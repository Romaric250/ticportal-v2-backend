import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
export class DashboardService {
    /**
     * Get complete dashboard overview for user
     */
    static async getDashboardOverview(userId) {
        try {
            logger.info({ userId }, "Fetching dashboard overview");
            // Fetch all data in parallel for performance
            const [user, stats, nextModule, team, deadlines, badges, badgeStats] = await Promise.all([
                this.getUserInfo(userId),
                this.getUserStats(userId),
                this.getNextModule(userId),
                this.getUserTeam(userId),
                this.getUpcomingDeadlines(userId, 5),
                this.getRecentBadges(userId, 3),
                this.getBadgeStats(userId),
            ]);
            return {
                user,
                stats,
                nextUp: nextModule,
                team,
                upcomingDeadlines: deadlines,
                recentBadges: badges,
                badgeStats,
            };
        }
        catch (error) {
            logger.error({ error: error.message, userId }, "Failed to get dashboard overview");
            throw error;
        }
    }
    /**
     * Get user basic info
     */
    static async getUserInfo(userId) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
        const initials = this.generateInitials(user.firstName, user.lastName);
        return {
            id: user.id,
            name,
            avatarUrl: user.profilePhoto,
            initials,
        };
    }
    /**
     * Get user stats (TP, level, streak)
     */
    static async getUserStats(userId) {
        // Get total points
        const totalPointsResult = await db.point.aggregate({
            where: { userId },
            _sum: { amount: true },
        });
        const totalTP = totalPointsResult._sum.amount || 0;
        // Get points today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tpTodayResult = await db.point.aggregate({
            where: {
                userId,
                createdAt: { gte: today },
            },
            _sum: { amount: true },
        });
        const tpToday = tpTodayResult._sum.amount || 0;
        // Calculate level
        const levelInfo = this.calculateLevel(totalTP);
        // Calculate streak
        const dayStreak = await this.calculateStreak(userId);
        return {
            totalTP,
            tpToday,
            currentLevel: levelInfo.currentLevel,
            levelName: levelInfo.levelName,
            dayStreak,
            levelProgress: levelInfo.progress,
        };
    }
    /**
     * Calculate user level from points
     */
    static calculateLevel(points) {
        const levels = [
            { level: 1, name: "Beginner", minPoints: 0, maxPoints: 500 },
            { level: 2, name: "Novice", minPoints: 500, maxPoints: 1000 },
            { level: 3, name: "Intermediate", minPoints: 1000, maxPoints: 2000 },
            { level: 4, name: "Scholar", minPoints: 2000, maxPoints: 3500 },
            { level: 5, name: "Advanced", minPoints: 3500, maxPoints: 5000 },
            { level: 6, name: "Expert", minPoints: 5000, maxPoints: 7500 },
            { level: 7, name: "Master", minPoints: 7500, maxPoints: 10000 },
            { level: 8, name: "Legend", minPoints: 10000, maxPoints: Infinity },
        ];
        // Find current level or default to level 1
        const currentLevelInfo = levels.find((l) => points >= l.minPoints && points < l.maxPoints);
        // If no level found (shouldn't happen), use level 1 as fallback
        if (!currentLevelInfo) {
            return {
                currentLevel: 1,
                levelName: "Beginner",
                progress: {
                    percentage: 0,
                    currentPoints: points,
                    nextLevelPoints: 500,
                    pointsNeeded: 500 - points,
                    nextLevelName: "Level 2 - Novice",
                },
            };
        }
        const nextLevelInfo = levels.find((l) => l.level === currentLevelInfo.level + 1);
        const pointsNeeded = nextLevelInfo ? nextLevelInfo.minPoints - points : 0;
        const percentage = nextLevelInfo
            ? Math.min(100, ((points - currentLevelInfo.minPoints) /
                (nextLevelInfo.minPoints - currentLevelInfo.minPoints)) *
                100)
            : 100;
        return {
            currentLevel: currentLevelInfo.level,
            levelName: currentLevelInfo.name,
            progress: {
                percentage: Math.round(percentage),
                currentPoints: points,
                nextLevelPoints: nextLevelInfo?.minPoints || points,
                pointsNeeded: Math.max(0, pointsNeeded),
                nextLevelName: nextLevelInfo
                    ? `Level ${nextLevelInfo.level} - ${nextLevelInfo.name}`
                    : "Max Level",
            },
        };
    }
    /**
     * Calculate day streak
     */
    static async calculateStreak(userId) {
        try {
            // Get user's point earning days (unique dates)
            const points = await db.point.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                select: { createdAt: true },
                take: 365, // Last year
            });
            if (points.length === 0)
                return 0;
            // Get unique days
            const uniqueDays = new Set();
            points.forEach((p) => {
                const date = new Date(p.createdAt);
                date.setHours(0, 0, 0, 0);
                const dateStr = date.toISOString().split("T")[0];
                if (dateStr) {
                    uniqueDays.add(dateStr);
                }
            });
            const sortedDays = Array.from(uniqueDays).sort().reverse();
            // Calculate streak from today backwards
            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < 365; i++) {
                const dateStr = currentDate.toISOString().split("T")[0];
                if (dateStr && sortedDays.includes(dateStr)) {
                    streak++;
                    currentDate.setDate(currentDate.getDate() - 1);
                }
                else if (streak > 0) {
                    // Streak broken
                    break;
                }
                else {
                    // Haven't started streak yet (no activity today)
                    currentDate.setDate(currentDate.getDate() - 1);
                }
            }
            return streak;
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to calculate streak");
            return 0;
        }
    }
    /**
     * Get next learning module to continue
     */
    static async getNextModule(userId) {
        try {
            // Get user's learning enrollments
            const enrollments = await db.learningEnrollment.findMany({
                where: { userId },
                include: {
                    learningPath: {
                        include: {
                            modules: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
                orderBy: { enrolledAt: "desc" },
            });
            if (enrollments.length === 0) {
                // Get first available active learning path
                const firstPath = await db.learningPath.findFirst({
                    where: { status: "ACTIVE" },
                    include: {
                        modules: {
                            orderBy: { order: "asc" },
                            take: 1,
                        },
                    },
                });
                if (!firstPath || firstPath.modules.length === 0 || !firstPath.modules[0])
                    return null;
                const firstModule = firstPath.modules[0];
                return {
                    moduleId: firstModule.id,
                    pathId: firstPath.id,
                    pathName: firstPath.title,
                    title: firstModule.title,
                    description: firstModule.content?.substring(0, 200) ||
                        "Start your learning journey",
                    category: "Academic",
                    status: "not_started",
                    progress: 0,
                    lastAccessed: null,
                    thumbnailUrl: null,
                    estimatedTime: "2h",
                    modulesCompleted: 0,
                    totalModules: firstPath.modules.length,
                };
            }
            // Find in-progress path
            for (const enrollment of enrollments) {
                const path = enrollment.learningPath;
                // Get completed modules
                const completedModules = await db.moduleCompletion.findMany({
                    where: {
                        userId,
                        moduleId: { in: path.modules.map((m) => m.id) },
                    },
                    select: { moduleId: true },
                });
                const completedIds = completedModules.map((c) => c.moduleId);
                const completedCount = completedIds.length;
                // If path is complete, skip
                if (completedCount >= path.modules.length)
                    continue;
                // Find next incomplete module
                const nextModule = path.modules.find((m) => !completedIds.includes(m.id));
                if (!nextModule)
                    continue;
                // Get last completion for last accessed
                const lastCompletion = await db.moduleCompletion.findFirst({
                    where: {
                        userId,
                        moduleId: { in: completedIds },
                    },
                    orderBy: { completedAt: "desc" },
                });
                // Calculate progress
                const progress = path.modules.length > 0
                    ? Math.round((completedCount / path.modules.length) * 100)
                    : 0;
                return {
                    moduleId: nextModule.id,
                    pathId: path.id,
                    pathName: path.title,
                    title: nextModule.title,
                    description: nextModule.content?.substring(0, 200) ||
                        "Continue your learning",
                    category: "Academic",
                    status: completedCount > 0 ? "in_progress" : "not_started",
                    progress,
                    lastAccessed: lastCompletion?.completedAt || null,
                    thumbnailUrl: null,
                    estimatedTime: "2h",
                    modulesCompleted: completedCount,
                    totalModules: path.modules.length,
                };
            }
            return null;
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get next module");
            return null;
        }
    }
    /**
     * Get user's team
     */
    static async getUserTeam(userId) {
        try {
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
            if (!teamMember)
                return null;
            const team = teamMember.team;
            // Generate team initials
            const teamInitials = team.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
            // Map members
            const members = team.members.map((m) => ({
                id: m.user.id,
                name: `${m.user.firstName || ""} ${m.user.lastName || ""}`.trim(),
                avatarUrl: m.user.profilePhoto,
                initials: this.generateInitials(m.user.firstName, m.user.lastName),
                role: m.role,
            }));
            // Get team's hackathon (if any)
            const hackathon = null; // TODO: Implement when hackathon module ready
            const teamInfo = {
                id: team.id,
                name: team.name,
                initials: teamInitials,
                phase: "Ideation phase", // TODO: Calculate based on progress
                memberCount: team.members.length,
                description: team.description || `${team.members.length} members`,
                members,
            };
            if (hackathon) {
                teamInfo.hackathon = hackathon;
            }
            return teamInfo;
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get user team");
            return null;
        }
    }
    /**
     * Get upcoming deadlines
     */
    static async getUpcomingDeadlines(userId, limit = 5) {
        try {
            const deadlines = [];
            const now = new Date();
            // Get deliverable deadlines
            const userTeams = await db.teamMember.findMany({
                where: { userId },
                select: { teamId: true },
            });
            const teamIds = userTeams.map((tm) => tm.teamId);
            if (teamIds.length > 0) {
                const deliverableTemplates = await db.deliverableTemplate.findMany({
                    where: {
                        dueDate: { gte: now },
                    },
                    orderBy: { dueDate: "asc" },
                    take: limit,
                });
                for (const template of deliverableTemplates) {
                    const dueDate = new Date(template.dueDate);
                    const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    let subtitle = "";
                    let variant = "info";
                    let priority = "medium";
                    if (daysUntil === 0) {
                        subtitle = "Due today";
                        variant = "danger";
                        priority = "high";
                    }
                    else if (daysUntil === 1) {
                        subtitle = "Due tomorrow";
                        variant = "danger";
                        priority = "high";
                    }
                    else if (daysUntil <= 7) {
                        subtitle = `Due in ${daysUntil} days`;
                        variant = "info";
                        priority = "medium";
                    }
                    else {
                        subtitle = `Due in ${Math.ceil(daysUntil / 7)} weeks`;
                        variant = "info";
                        priority = "low";
                    }
                    const deadline = {
                        id: template.id,
                        title: template.title,
                        subtitle,
                        date: dueDate.toISOString().split("T")[0] || "",
                        dueDate,
                        variant,
                        type: "deliverable_submission",
                        priority,
                    };
                    if (template.hackathonId) {
                        deadline.hackathonId = template.hackathonId;
                    }
                    deadlines.push(deadline);
                }
            }
            // Get mentor sessions
            const mentorSessions = await db.mentorSession.findMany({
                where: {
                    teamId: { in: teamIds },
                    date: { gte: now },
                },
                orderBy: { date: "asc" },
                take: limit,
                include: {
                    assignment: {
                        select: {
                            mentorId: true,
                        },
                    },
                },
            });
            for (const session of mentorSessions) {
                const sessionDate = new Date(session.date);
                const daysUntil = Math.ceil((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const deadline = {
                    id: session.id,
                    title: "Mentor check-in",
                    subtitle: daysUntil === 0 ? "Today" : `In ${daysUntil} days`,
                    date: sessionDate.toISOString().split("T")[0] || "",
                    dueDate: sessionDate,
                    variant: "purple",
                    type: "mentor_checkin",
                    priority: "low",
                };
                if (session.assignment.mentorId) {
                    deadline.mentorId = session.assignment.mentorId;
                }
                deadlines.push(deadline);
            }
            // Sort by date and limit
            return deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, limit);
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get upcoming deadlines");
            return [];
        }
    }
    /**
     * Get recent badges
     */
    static async getRecentBadges(userId, limit = 3) {
        try {
            const userBadges = await db.userBadge.findMany({
                where: { userId },
                include: {
                    badge: true,
                },
                orderBy: { earnedAt: "desc" },
                take: limit,
            });
            return userBadges.map((ub) => ({
                id: ub.id,
                badgeId: ub.badge.badgeId,
                name: ub.badge.name,
                icon: ub.badge.icon || "🏅",
                color: this.getBadgeColor(ub.badge.tier),
                earnedAt: ub.earnedAt,
                points: ub.badge.points,
                locked: false,
            }));
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get recent badges");
            return [];
        }
    }
    /**
     * Get badge stats
     */
    static async getBadgeStats(userId) {
        try {
            const [badgeCount, badgePoints] = await Promise.all([
                db.userBadge.count({
                    where: { userId },
                }),
                db.userBadge.findMany({
                    where: { userId },
                    include: {
                        badge: {
                            select: { points: true },
                        },
                    },
                }),
            ]);
            const totalPoints = badgePoints.reduce((sum, ub) => sum + (ub.badge.points || 0), 0);
            return {
                totalBadges: badgeCount,
                totalPoints,
            };
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get badge stats");
            return {
                totalBadges: 0,
                totalPoints: 0,
            };
        }
    }
    // ==================== HELPER METHODS ====================
    /**
     * Generate initials safely
     */
    static generateInitials(firstName, lastName) {
        const first = firstName?.trim() || "";
        const last = lastName?.trim() || "";
        if (first && last) {
            return `${first[0]}${last[0]}`.toUpperCase();
        }
        else if (first && first.length >= 2) {
            return first.substring(0, 2).toUpperCase();
        }
        else if (first && first.length === 1) {
            return first.toUpperCase();
        }
        else if (last && last.length >= 2) {
            return last.substring(0, 2).toUpperCase();
        }
        else if (last && last.length === 1) {
            return last.toUpperCase();
        }
        else {
            return "??";
        }
    }
    /**
     * Get badge color from tier
     */
    static getBadgeColor(tier) {
        const colors = {
            BRONZE: "amber",
            SILVER: "slate",
            GOLD: "yellow",
            PLATINUM: "purple",
        };
        return colors[tier || "BRONZE"] || "sky";
    }
}
//# sourceMappingURL=service.js.map