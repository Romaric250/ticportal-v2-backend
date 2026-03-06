import { db } from "../../config/database";
import type { Prisma } from "@prisma/client";
import { UserRole, UserStatus, TeamRole } from "@prisma/client";

export class AdminService {
  /** Normalize region names to consolidate variants (North West→Northwest, Center→Centre) */
  private static normalizeRegionName(region: string | null): string {
    if (!region || !region.trim()) return "Unassigned";
    const r = region.trim();
    const lower = r.toLowerCase();
    if (lower === "north west" || lower === "northwest") return "Northwest";
    if (lower === "center" || lower === "centre") return "Centre";
    return r;
  }

  /**
   * Get students by region with paid counts
   */
  static async getUsersByRegionStats() {
    const students = await db.user.findMany({
      where: { role: UserRole.STUDENT },
      select: {
        id: true,
        region: true,
        payments: {
          where: { status: "CONFIRMED" },
          take: 1,
          select: { id: true },
        },
      },
    });

    const byRegion = new Map<string, { total: number; paid: number }>();
    for (const s of students) {
      const region = this.normalizeRegionName(s.region);
      const current = byRegion.get(region) || { total: 0, paid: 0 };
      current.total++;
      if (s.payments.length > 0) current.paid++;
      byRegion.set(region, current);
    }

    return Array.from(byRegion.entries())
      .map(([region, stats]) => ({ region, ...stats }))
      .sort((a, b) => b.total - a.total);
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      pendingUsers,
      mentorsAndLeads,
      totalTeams,
      activeTeams,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: UserStatus.PENDING } }),
      db.user.count({
        where: {
          role: {
            in: [UserRole.MENTOR, UserRole.SQUAD_LEAD, UserRole.JUDGE],
          },
        },
      }),
      db.team.count(),
      db.team.count({
        where: {
          members: {
            some: {},
          },
        },
      }),
    ]);

    // Calculate change from last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthUsers = await db.user.count({
      where: {
        createdAt: { lt: lastMonth },
      },
    });

    const totalUsersChange = totalUsers - lastMonthUsers;

    return {
      totalUsers,
      pendingApprovals: pendingUsers,
      mentorsAndLeads,
      unassignedJudges: 0, // TODO: Implement judge assignment logic
      totalUsersChange,
    };
  }

  /**
   * Get detailed dashboard statistics
   */
  static async getDetailedDashboardStats() {
    // Users by role
    const usersByRole = await db.user.groupBy({
      by: ["role"],
      _count: true,
    });

    // Users by status  
    const usersByStatus = await db.user.groupBy({
      by: ["status"],
      _count: true,
    });

    // Users over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersCreatedRecently = await db.user.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const usersOverTimeMap = new Map<string, number>();
    usersCreatedRecently.forEach((user) => {
      const date = user.createdAt.toISOString().split("T")[0];
      if (date) {
        usersOverTimeMap.set(date, (usersOverTimeMap.get(date) || 0) + 1);
      }
    });

    const usersOverTime = Array.from(usersOverTimeMap.entries())
      .map(([date, count]) => ({
        date,
        users: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending

    const [teamsCount, activeTeams] = await Promise.all([
      db.team.count(),
      db.team.count({
        where: {
          members: {
            some: {},
          },
        },
      }),
    ]);

    return {
      usersByRole: usersByRole.map((r) => ({
        role: r.role,
        count: r._count,
      })),
      usersByStatus: usersByStatus.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      usersOverTime,
      teamsCount,
      activeTeams,
    };
  }

  /**
   * Get users with pagination and filters
   */
  static async getUsers(filters: {
    page?: number;
    limit?: number;
    role?: UserRole;
    jurisdiction?: string;
    status?: UserStatus;
    search?: string;
    paymentStatus?: "paid" | "not_paid"; // For students: filter by payment
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.jurisdiction && filters.jurisdiction !== "All Regions" && filters.jurisdiction !== "All Areas") {
      where.region = filters.jurisdiction;
    }

    if (filters.search) {
      const searchConditions: any[] = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { school: { contains: filters.search, mode: "insensitive" } },
      ];
      
      // Only search by ID if the search term is a valid MongoDB ObjectId (24 hex characters)
      if (/^[a-f\d]{24}$/i.test(filters.search)) {
        searchConditions.push({ id: filters.search });
      }
      
      where.OR = searchConditions;
    }

    if (filters.paymentStatus) {
      where.role = UserRole.STUDENT;
      if (filters.paymentStatus === "paid") {
        where.payments = { some: { status: "CONFIRMED" } };
      } else {
        where.NOT = {
          payments: { some: { status: "CONFIRMED" } },
        };
      }
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          profilePhoto: true,
          role: true,
          school: true,
          region: true,
          isVerified: true,
          status: true,
          createdAt: true,
          lastLogin: true,
          teamMembers: {
            include: {
              team: {
                select: {
                  name: true,
                },
              },
            },
            take: 1,
          },
          payments: {
            where: { status: "CONFIRMED" },
            take: 1,
            select: { id: true, metadata: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => {
      const { payments, ...rest } = user;
      const payment = payments[0];
      const meta = payment?.metadata as Record<string, unknown> | null;
      const isManualSubscription = !!(meta?.manualSubscription);
      return {
        ...rest,
        affiliation: user.teamMembers[0]?.team.name || null,
        jurisdiction: user.region,
        hasPaid: user.role === "STUDENT" ? payments.length > 0 : undefined,
        isManualSubscription: user.role === "STUDENT" && payments.length > 0 ? isManualSubscription : undefined,
      };
    });

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single user by ID
   */
  static async getUserById(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        teamMembers: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Create user (admin)
   * Returns user and plainPassword for admin to copy (when password was auto-generated)
   */
  static async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    school?: string;
    region?: string;
    password?: string;
  }) {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Generate random password if not provided
    const plainPassword = data.password || Math.random().toString(36).slice(-8);
    
    // Hash password
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await db.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        school: data.school || null,
        region: data.region || null,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
    });

    return { user, plainPassword: data.password ? undefined : plainPassword };
  }

  /**
   * Admin: Send OTP to email for verification before creating new user
   * Email may not belong to an existing user
   */
  static async sendVerificationOtp(email: string) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const { sendVerificationEmail } = await import("../../shared/utils/email");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.adminEmailVerification.create({
      data: { email, code, expiresAt },
    });

    await sendVerificationEmail(email, "User", code);
    return { message: "OTP sent successfully to email" };
  }

  /**
   * Admin: Verify OTP and create user
   * Returns user and plainPassword for admin to copy
   */
  static async verifyAndCreateUser(data: {
    email: string;
    code: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    school?: string;
    region?: string;
    password?: string;
  }) {
    const verification = await db.adminEmailVerification.findFirst({
      where: {
        email: data.email,
        code: data.code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      throw new Error("Invalid or expired OTP");
    }

    await db.adminEmailVerification.delete({ where: { id: verification.id } });

    const result = await this.createUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      ...(data.school !== undefined && { school: data.school }),
      ...(data.region !== undefined && { region: data.region }),
      ...(data.password !== undefined && { password: data.password }),
    });

    return result;
  }

  /**
   * Update user
   */
  static async updateUser(
    userId: string,
    data: {
      role?: UserRole;
      status?: UserStatus;
      school?: string;
      region?: string;
      isVerified?: boolean;
    }
  ) {
    const user = await db.user.update({
      where: { id: userId },
      data,
    });

    // TODO: Send notification about role/status change

    return user;
  }

  /**
   * Bulk delete users
   */
  static async deleteUsers(userIds: string[]): Promise<{ deleted: number; failed: Array<{ userId: string; error: string }> }> {
    const failed: Array<{ userId: string; error: string }> = [];
    let deleted = 0;
    for (const userId of userIds) {
      try {
        await this.deleteUser(userId);
        deleted++;
      } catch (err: any) {
        failed.push({ userId, error: err.message || "Unknown error" });
      }
    }
    return { deleted, failed };
  }

  /**
   * Delete user
   * Must delete all records that reference the user (no onDelete: Cascade) before deleting.
   * Runs without transaction to avoid MongoDB server monitor timeout on long bulk deletes.
   * Includes retry logic for transient connection errors.
   */
  static async deleteUser(userId: string) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;

    const deleteOperations = async () => {
      // Order matters: Commission/Payment reference StudentReferral
      await db.oTP.deleteMany({ where: { userId } });
      await db.refreshToken.deleteMany({ where: { userId } });
      await db.point.deleteMany({ where: { userId } });
      await db.userBadge.deleteMany({ where: { userId } });
      await db.userProgress.deleteMany({ where: { userId } });
      await db.squadMember.deleteMany({ where: { userId } });
      await db.teamMember.deleteMany({ where: { userId } });
      await db.teamJoinRequest.deleteMany({ where: { userId } });
      await db.teamChatRead.deleteMany({ where: { userId } });
      await db.teamChat.deleteMany({ where: { senderId: userId } });
      await db.score.deleteMany({ where: { judgeId: userId } });
      await db.mentorRequest.deleteMany({ where: { mentorId: userId } });
      await db.mentorAssignment.deleteMany({ where: { mentorId: userId } });
      await db.commission.deleteMany({ where: { userId } });
      await db.payment.deleteMany({ where: { userId } });
      await db.studentReferral.deleteMany({
        where: { OR: [{ referrerId: userId }, { studentId: userId }] },
      });
      await db.leaderboard.deleteMany({ where: { userId } });
      await db.portfolio.deleteMany({ where: { userId } });
      await db.affiliateProfile.deleteMany({ where: { userId } });
      await db.teamDeliverable.updateMany({
        where: { reviewedBy: userId },
        data: { reviewedBy: null },
      });
      await db.user.delete({ where: { id: userId } });
    };

    const isTransientError = (err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      return (
        msg.includes("TransientTransactionError") ||
        msg.includes("server monitor timeout") ||
        msg.includes("Connection") && msg.includes("interrupted")
      );
    };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await deleteOperations();
        return;
      } catch (err) {
        if (attempt < MAX_RETRIES && isTransientError(err)) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
        } else {
          throw err;
        }
      }
    }
  }

  /**
   * Get all teams with filters
   */
  static async getTeams(filters: {
    page?: number;
    limit?: number;
    school?: string;
    status?: string;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.TeamWhereInput = {};

    if (filters.school) {
      where.school = { contains: filters.school, mode: "insensitive" };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { projectTitle: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [teams, total] = await Promise.all([
      db.team.findMany({
        where,
        skip,
        take: limit,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  profilePhoto: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.team.count({ where }),
    ]);

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get team by ID
   */
  static async getTeamById(teamId: string) {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  /**
   * Update team (admin override)
   */
  static async updateTeam(
    teamId: string,
    data: {
      name?: string;
      projectTitle?: string;
      description?: string;
    }
  ) {
    const team = await db.team.update({
      where: { id: teamId },
      data,
    });

    return team;
  }

  /**
   * Delete team (admin only)
   */
  static async deleteTeam(teamId: string) {
    // Check if team has submissions
    const submissionCount = await db.submission.count({
      where: { teamId },
    });

    if (submissionCount > 0) {
      throw new Error("Cannot delete team with existing submissions");
    }

    await db.team.delete({
      where: { id: teamId },
    });
  }

  /**
   * Get team members
   */
  static async getTeamMembers(teamId: string) {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team.members;
  }

  /**
   * Add member to team
   */
  static async addTeamMember(
    teamId: string,
    userId: string,
    role?: string
  ) {
    // Check if team exists
    const team = await db.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already a member
    const existingMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (existingMember) {
      throw new Error("User is already a team member");
    }

    // Add member
    const member = await db.teamMember.create({
      data: {
        userId,
        teamId,
        role: (role as TeamRole) || TeamRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
      },
    });

    return member;
  }

  /**
   * Remove member from team
   */
  static async removeTeamMember(teamId: string, userId: string) {
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!member) {
      throw new Error("Team member not found");
    }

    await db.teamMember.delete({
      where: {
        id: member.id,
      },
    });
  }

  /**
   * Update team member role
   */
  static async updateTeamMemberRole(
    teamId: string,
    userId: string,
    role: string
  ) {
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!member) {
      throw new Error("Team member not found");
    }

    const updatedMember = await db.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        role: role as TeamRole,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
      },
    });

    return updatedMember;
  }

  /**
   * Get team submissions/projects
   */
  static async getTeamSubmissions(teamId: string) {
    const submissions = await db.submission.findMany({
      where: { teamId },
      orderBy: { submittedAt: "desc" },
    });

    return submissions;
  }
}
