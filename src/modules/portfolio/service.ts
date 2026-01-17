import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import type {
  PortfolioOverview,
  ProfileInfo,
  HackathonPhase,
  FeaturedProject,
  Certification,
  BadgeInfo,
  MentorFeedback,
  Skill,
  TeamMemberInfo,
} from "./types";

export class PortfolioService {
  /**
   * Get complete portfolio overview for user
   */
  static async getPortfolioOverview(userId: string): Promise<PortfolioOverview> {
    try {
      logger.info({ userId }, "Fetching portfolio overview");

      // Fetch all data in parallel
      const [profile, journey, project, certs, badges, feedback, skills] =
        await Promise.all([
          this.getProfileInfo(userId),
          this.getHackathonJourney(userId),
          this.getFeaturedProject(userId),
          this.getCertifications(userId),
          this.getBadges(userId),
          this.getMentorFeedback(userId),
          this.getSkills(userId),
        ]);

      return {
        profile,
        hackathonJourney: journey,
        featuredProject: project,
        certifications: certs,
        badges,
        mentorFeedback: feedback,
        skills,
      };
    } catch (error: any) {
      logger.error(
        { error: error.message, userId },
        "Failed to get portfolio overview"
      );
      throw error;
    }
  }

  /**
   * Get profile information
   */
  private static async getProfileInfo(userId: string): Promise<ProfileInfo> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePhoto: true,
        school: true,
        grade: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get total points
    const pointsResult = await db.point.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    const totalXP = pointsResult._sum.amount || 0;

    // Calculate level
    const levelInfo = this.calculateLevelFromPoints(totalXP);

    if (!levelInfo) {
      throw new Error("Failed to calculate level");
    }

    // Get global rank (from leaderboard)
    const allUserPoints = await db.point.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    });

    const userRankIndex = allUserPoints.findIndex(
      (up) => up.userId === userId
    );
    const globalRank = userRankIndex >= 0 ? userRankIndex + 1 : 0;

    // Calculate hours logged (estimate from activity)
    const activityCount = await db.userActivity.count({
      where: { userId },
    });
    const hoursLogged = Math.floor(activityCount / 10); // Rough estimate

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const initials = this.generateInitials(user.firstName, user.lastName);

    // Parse grade to number if it's a string
    let gradeNumber: number | null = null;
    if (user.grade !== null) {
      if (typeof user.grade === "number") {
        gradeNumber = user.grade;
      } else if (typeof user.grade === "string") {
        const parsed = parseInt(user.grade, 10);
        gradeNumber = isNaN(parsed) ? null : parsed;
      }
    }

    return {
      id: user.id,
      name,
      email: user.email,
      avatarUrl: user.profilePhoto,
      initials,
      school: user.school,
      grade: gradeNumber,
      level: levelInfo.level,
      levelTitle: levelInfo.name,
      totalXP,
      globalRank,
      hoursLogged,
      bio: user.bio,
    };
  }

  /**
   * Get hackathon journey phases
   */
  private static async getHackathonJourney(
    userId: string
  ): Promise<HackathonPhase[]> {
    try {
      const phases: HackathonPhase[] = [];

      // Phase 1: Bootcamp - Check learning path completion
      const learningEnrollments = await db.learningEnrollment.findMany({
        where: { userId },
        include: {
          learningPath: {
            include: {
              modules: true,
            },
          },
        },
      });

      if (learningEnrollments.length > 0) {
        const firstEnrollment = learningEnrollments[0];
        
        if (!firstEnrollment || !firstEnrollment.learningPath) {
          phases.push({
            id: "phase_1",
            phase: "Bootcamp Phase",
            status: "pending",
            description: "Complete core modules on Design Thinking.",
            tags: ["Design Thinking", "Ideation"],
            icon: "check",
            progress: 0,
          });
        } else {
          const path = firstEnrollment.learningPath;

          const completedModules = await db.moduleCompletion.count({
            where: {
              userId,
              moduleId: { in: path.modules.map((m) => m.id) },
            },
          });

          const progress =
            path.modules.length > 0
              ? Math.round((completedModules / path.modules.length) * 100)
              : 0;

          const lastCompletion = await db.moduleCompletion.findFirst({
            where: {
              userId,
              moduleId: { in: path.modules.map((m) => m.id) },
            },
            orderBy: { completedAt: "desc" },
          });

          const phase: HackathonPhase = {
            id: "phase_1",
            phase: "Bootcamp Phase",
            status: progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending",
            startedAt: firstEnrollment.enrolledAt,
            description: `Completed ${completedModules} of ${path.modules.length} modules on Design Thinking and Problem Identification.`,
            tags: ["Design Thinking", "Ideation"],
            icon: "check",
            progress,
            modulesCompleted: completedModules,
            totalModules: path.modules.length,
          };

          if (progress === 100 && lastCompletion) {
            phase.completedAt = lastCompletion.completedAt;
          }

          phases.push(phase);
        }
      } else {
        phases.push({
          id: "phase_1",
          phase: "Bootcamp Phase",
          status: "pending",
          description: "Complete core modules on Design Thinking and Problem Identification.",
          tags: ["Design Thinking", "Ideation"],
          icon: "check",
          progress: 0,
        });
      }

      // Phase 2: Team Formation
      const teamMember = await db.teamMember.findFirst({
        where: { userId },
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      profilePhoto: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });

      if (teamMember) {
        const teamMembers: TeamMemberInfo[] = teamMember.team.members.map(
          (m) => ({
            id: m.user.id,
            name: `${m.user.firstName || ""} ${m.user.lastName || ""}`.trim(),
            avatarUrl: m.user.profilePhoto,
            initials: this.generateInitials(
              m.user.firstName,
              m.user.lastName
            ),
          })
        );

        phases.push({
          id: "phase_2",
          phase: "Team Formation",
          status: "completed",
          completedAt: teamMember.joinedAt,
          description: `Formed '${teamMember.team.name}' with ${teamMember.team.members.length} peers.`,
          teamMembers,
          icon: "users",
          progress: 100,
        });
      } else {
        phases.push({
          id: "phase_2",
          phase: "Team Formation",
          status: "pending",
          description: "Form a team and define roles.",
          icon: "users",
          progress: 0,
        });
      }

      // Phase 3: Summit Finalist
      // TODO: Implement when hackathon phase tracking is available
      phases.push({
        id: "phase_3",
        phase: "Summit Finalist",
        status: "pending",
        description: "Develop MVP and Pitch Deck.",
        icon: "rocket",
        progress: 0,
      });

      // Phase 4: Final Awards
      phases.push({
        id: "phase_4",
        phase: "Final Awards",
        status: "pending",
        description: "The big day. Presentation and scoring.",
        icon: "trophy",
        progress: 0,
      });

      return phases;
    } catch (error) {
      logger.error({ error, userId }, "Failed to get hackathon journey");
      return [];
    }
  }

  /**
   * Get featured project
   */
  private static async getFeaturedProject(
    userId: string
  ): Promise<FeaturedProject | null> {
    try {
      // For now, return null
      // TODO: Implement when project system is ready
      return null;
    } catch (error) {
      logger.error({ error, userId }, "Failed to get featured project");
      return null;
    }
  }

  /**
   * Get certifications
   */
  private static async getCertifications(
    userId: string
  ): Promise<Certification[]> {
    try {
      const certs: Certification[] = [];

      // Get course completions
      const completions = await db.moduleCompletion.findMany({
        where: { userId },
        include: {
          module: {
            include: {
              path: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      });

      for (const completion of completions) {
        certs.push({
          id: completion.id,
          title: completion.module.path.title,
          issuer: "TIC SUMMIT",
          description: completion.module.title,
          issuedAt: completion.completedAt,
          certificateUrl: null, // TODO: Generate certificate URLs
          icon: "check",
          type: "course_completion",
        });
      }

      return certs;
    } catch (error) {
      logger.error({ error, userId }, "Failed to get certifications");
      return [];
    }
  }

  /**
   * Get badges
   */
  private static async getBadges(userId: string): Promise<BadgeInfo[]> {
    try {
      // Get earned badges
      const userBadges = await db.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: { earnedAt: "desc" },
      });

      const badges: BadgeInfo[] = userBadges.map((ub) => ({
        id: ub.id,
        badgeId: ub.badge.badgeId,
        name: ub.badge.name,
        icon: ub.badge.icon || "🏅",
        color: this.getBadgeColor(ub.badge.tier),
        earnedAt: ub.earnedAt,
        locked: false,
        points: ub.badge.points,
        category: ub.badge.category,
        tier: ub.badge.tier,
      }));

      // Get locked badges (not earned yet) - just a few examples
      const allBadges = await db.badge.findMany({
        where: {
          badgeId: {
            notIn: userBadges.map((ub) => ub.badge.badgeId),
          },
        },
        take: 3,
      });

      for (const badge of allBadges) {
        badges.push({
          id: badge.id,
          badgeId: badge.badgeId,
          name: badge.name,
          icon: "🔒",
          color: "slate",
          earnedAt: null,
          locked: true,
          points: badge.points,
          category: badge.category,
          tier: badge.tier,
        });
      }

      return badges;
    } catch (error) {
      logger.error({ error, userId }, "Failed to get badges");
      return [];
    }
  }

  /**
   * Get mentor feedback
   */
  private static async getMentorFeedback(
    userId: string
  ): Promise<MentorFeedback[]> {
    try {
      // For now, return empty array
      // TODO: Implement when mentor feedback system is ready
      return [];
    } catch (error) {
      logger.error({ error, userId }, "Failed to get mentor feedback");
      return [];
    }
  }

  /**
   * Get skills
   */
  private static async getSkills(userId: string): Promise<Skill[]> {
    try {
      // For now, return empty array
      // TODO: Implement skills tracking system
      return [];
    } catch (error) {
      logger.error({ error, userId }, "Failed to get skills");
      return [];
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Calculate level from points
   */
  private static calculateLevelFromPoints(points: number) {
    const levels = [
      { level: 1, name: "Beginner", minPoints: 0 },
      { level: 2, name: "Novice", minPoints: 500 },
      { level: 3, name: "Finalist", minPoints: 1000 },
      { level: 4, name: "Scholar", minPoints: 2000 },
      { level: 5, name: "Advanced", minPoints: 3500 },
      { level: 6, name: "Expert", minPoints: 5000 },
      { level: 7, name: "Master", minPoints: 7500 },
      { level: 8, name: "Legend", minPoints: 10000 },
    ];

    const currentLevel = levels
      .slice()
      .reverse()
      .find((l) => points >= l.minPoints);

    return currentLevel || levels[0];
  }

  /**
   * Generate initials safely
   */
  private static generateInitials(
    firstName?: string | null,
    lastName?: string | null
  ): string {
    const first = firstName?.trim() || "";
    const last = lastName?.trim() || "";

    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    } else if (first && first.length >= 2) {
      return first.substring(0, 2).toUpperCase();
    } else if (first && first.length === 1) {
      return first.toUpperCase();
    } else if (last && last.length >= 2) {
      return last.substring(0, 2).toUpperCase();
    } else if (last && last.length === 1) {
      return last.toUpperCase();
    } else {
      return "??";
    }
  }

  /**
   * Get badge color from tier
   */
  private static getBadgeColor(tier?: string): string {
    const colors: { [key: string]: string } = {
      BRONZE: "amber",
      SILVER: "slate",
      GOLD: "yellow",
      PLATINUM: "purple",
    };
    return colors[tier || "BRONZE"] || "sky";
  }
}
