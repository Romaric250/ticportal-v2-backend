import { db } from "../../config/database";
import type { Prisma } from "@prisma/client";
import { UserRole, UserStatus, TeamRole, PaymentStatus, PaymentMethod } from "@prisma/client";
import { DELIVERABLES_COMPLETE_TARGET } from "../grading/service";
import { sendTicCommunityWelcomeEmail } from "../../shared/utils/email";

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

  private static readonly MANUAL_PAYMENT_METHODS: PaymentMethod[] = [
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CASH,
    PaymentMethod.OTHER,
  ];
  private static readonly ONLINE_PAYMENT_METHODS: PaymentMethod[] = [
    PaymentMethod.MOBILE_MONEY,
    PaymentMethod.CARD,
  ];

  /**
   * Team IDs with at least `min` required deliverables submitted (same rules as list rows: template.required !== false).
   * Uses DB-side aggregation — avoids loading every submitted row into memory (MongoDB full scan / OOM).
   */
  private static async teamIdsWithAtLeastNRequiredSubmitted(min: number): Promise<string[]> {
    const allowedTemplates = await db.deliverableTemplate.findMany({
      where: { NOT: { required: false } },
      select: { id: true },
    });
    const allowedTemplateIds = allowedTemplates.map((t) => t.id);
    if (allowedTemplateIds.length === 0) return [];

    const grouped = await db.teamDeliverable.groupBy({
      by: ["teamId"],
      where: {
        submissionStatus: "SUBMITTED",
        templateId: { in: allowedTemplateIds },
      },
      _count: { _all: true },
    });
    return grouped.filter((g) => g._count._all >= min).map((g) => g.teamId);
  }

  /**
   * Get students by region with paid counts.
   * Optional `paymentChannel`: `all` | `manual` | `online` — `paid` counts students with at least one confirmed payment in that channel.
   */
  static async getUsersByRegionStats(params?: { paymentChannel?: "all" | "manual" | "online" }) {
    const channel = params?.paymentChannel ?? "all";

    const students = await db.user.findMany({
      where: { role: UserRole.STUDENT },
      select: {
        id: true,
        region: true,
        payments: {
          where: { status: PaymentStatus.CONFIRMED },
          select: { paymentMethod: true },
        },
      },
    });

    const byRegion = new Map<
      string,
      { total: number; paidAny: number; paidManualStudents: number; paidOnlineStudents: number }
    >();

    for (const s of students) {
      const region = this.normalizeRegionName(s.region);
      const cur = byRegion.get(region) || {
        total: 0,
        paidAny: 0,
        paidManualStudents: 0,
        paidOnlineStudents: 0,
      };
      cur.total++;
      if (s.payments.length > 0) cur.paidAny++;
      const hasManual = s.payments.some((p) =>
        this.MANUAL_PAYMENT_METHODS.includes(p.paymentMethod)
      );
      const hasOnline = s.payments.some((p) =>
        this.ONLINE_PAYMENT_METHODS.includes(p.paymentMethod)
      );
      if (hasManual) cur.paidManualStudents++;
      if (hasOnline) cur.paidOnlineStudents++;
      byRegion.set(region, cur);
    }

    return Array.from(byRegion.entries())
      .map(([region, stats]) => {
        let paid = stats.paidAny;
        if (channel === "manual") paid = stats.paidManualStudents;
        else if (channel === "online") paid = stats.paidOnlineStudents;
        return {
          region,
          total: stats.total,
          paid,
          paidManual: stats.paidManualStudents,
          paidOnline: stats.paidOnlineStudents,
          paymentChannel: channel,
        };
      })
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
    paymentStatus?: "paid" | "not_paid" | "manual_paid"; // Students: payment channel
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
        where.payments = { some: { status: PaymentStatus.CONFIRMED } };
      } else if (filters.paymentStatus === "not_paid") {
        where.NOT = {
          payments: { some: { status: PaymentStatus.CONFIRMED } },
        };
      } else if (filters.paymentStatus === "manual_paid") {
        where.payments = {
          some: {
            status: PaymentStatus.CONFIRMED,
            paymentMethod: { in: this.MANUAL_PAYMENT_METHODS },
          },
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
            where: { status: PaymentStatus.CONFIRMED },
            select: { id: true, metadata: true, paymentMethod: true },
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
      const isManualChannelPaid =
        user.role === "STUDENT" &&
        payments.some(
          (p) =>
            this.MANUAL_PAYMENT_METHODS.includes(p.paymentMethod) ||
            !!((p.metadata as Record<string, unknown> | null)?.manualSubscription)
        );
      return {
        ...rest,
        affiliation: user.teamMembers[0]?.team.name || null,
        jurisdiction: user.region,
        hasPaid: user.role === "STUDENT" ? payments.length > 0 : undefined,
        isManualChannelPaid: user.role === "STUDENT" && payments.length > 0 ? isManualChannelPaid : undefined,
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

  static async getTeams(filters: {
    page?: number;
    limit?: number;
    school?: string;
    status?: string;
    search?: string;
    /** Filter teams that have at least one member (prefer lead) in this region. */
    region?: string;
    /** Only teams with at least this many required deliverables submitted (1–7). Omitted or 0 = no filter. */
    minDeliverablesSubmitted?: number;
    /**
     * When false, skips scanning TeamDeliverable + templates (fast — e.g. assignment modals).
     * Counts are returned as 0. Default true for grading/admin lists that need real numbers.
     */
    includeDeliverableStats?: boolean;
  }) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 500);
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

    if (filters.region?.trim()) {
      const r = filters.region.trim();
      where.members = {
        some: {
          user: { region: { equals: r, mode: "insensitive" } },
        },
      };
    }

    const includeDeliverableStats = filters.includeDeliverableStats !== false;

    const minDel =
      filters.minDeliverablesSubmitted != null && Number.isFinite(Number(filters.minDeliverablesSubmitted))
        ? Math.min(DELIVERABLES_COMPLETE_TARGET, Math.max(0, Math.floor(Number(filters.minDeliverablesSubmitted))))
        : 0;

    if (minDel >= 1) {
      const eligibleIds = await AdminService.teamIdsWithAtLeastNRequiredSubmitted(minDel);
      if (eligibleIds.length === 0) {
        return {
          teams: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: page > 1,
          },
        };
      }
      where.id = { in: eligibleIds };
    }

    const hasNarrowWhere =
      Boolean(filters.search?.trim() || filters.school || filters.region?.trim()) || minDel >= 1;

    const teamSelect = {
      id: true,
      name: true,
      school: true,
      projectTitle: true,
      description: true,
      createdAt: true,
    } as const;

    let teamsRaw: Array<{
      id: string;
      name: string;
      school: string;
      projectTitle: string | null;
      description: string | null;
      createdAt: Date;
    }>;
    let total: number | null = null;
    let totalPages: number | null = null;
    let hasNextPage: boolean;

    if (hasNarrowWhere) {
      const [rows, totalCount] = await Promise.all([
        db.team.findMany({
          where,
          skip,
          take: limit,
          select: teamSelect,
          orderBy: { id: "desc" },
        }),
        db.team.count({ where }),
      ]);
      teamsRaw = rows;
      total = totalCount;
      totalPages = Math.ceil(totalCount / limit) || 1;
      hasNextPage = skip + rows.length < totalCount;
    } else {
      const rows = await db.team.findMany({
        where,
        skip,
        take: limit + 1,
        select: teamSelect,
        orderBy: { id: "desc" },
      });
      hasNextPage = rows.length > limit;
      teamsRaw = hasNextPage ? rows.slice(0, limit) : rows;
    }

    const teamIds = teamsRaw.map((t) => t.id);

    if (teamIds.length === 0) {
      return {
        teams: [],
        pagination: { page, limit, total: total ?? 0, totalPages: totalPages ?? 0, hasNextPage, hasPrevPage: page > 1 },
      };
    }

    const [leadRows, assignmentGroup, memberGroup] = await Promise.all([
      db.teamMember.findMany({
        where: { teamId: { in: teamIds }, role: TeamRole.LEAD },
        include: { user: { select: { region: true } } },
      }),
      db.teamAssignment.groupBy({
        by: ["teamId"],
        where: { teamId: { in: teamIds } },
        _count: { _all: true },
      }),
      db.teamMember.groupBy({
        by: ["teamId"],
        where: { teamId: { in: teamIds } },
        _count: { _all: true },
      }),
    ]);

    const regionByTeamId = new Map(leadRows.map((row) => [row.teamId, row.user.region?.trim() || null]));
    const reviewerAssignmentCountByTeam = new Map(assignmentGroup.map((g) => [g.teamId, g._count._all]));
    const memberCountByTeam = new Map(memberGroup.map((g) => [g.teamId, g._count._all]));

    let deliverableTotalByTeam = new Map<string, number>();
    let deliverableSubmittedByTeam = new Map<string, number>();

    if (includeDeliverableStats) {
      const optionalTemplates = await db.deliverableTemplate.findMany({
        where: { required: false },
        select: { id: true },
      });
      const optionalIds = optionalTemplates.map((t) => t.id);

      const baseWhere = {
        teamId: { in: teamIds },
        ...(optionalIds.length > 0 ? { templateId: { notIn: optionalIds } } : {}),
      };

      const [totalGroup, submittedGroup] = await Promise.all([
        db.teamDeliverable.groupBy({
          by: ["teamId"],
          where: baseWhere,
          _count: { _all: true },
        }),
        db.teamDeliverable.groupBy({
          by: ["teamId"],
          where: { ...baseWhere, submissionStatus: "SUBMITTED" },
          _count: { _all: true },
        }),
      ]);

      deliverableTotalByTeam = new Map(totalGroup.map((g) => [g.teamId, g._count._all]));
      deliverableSubmittedByTeam = new Map(submittedGroup.map((g) => [g.teamId, g._count._all]));
    }

    let teams = teamsRaw.map((t) => ({
      id: t.id,
      name: t.name,
      school: t.school,
      region: regionByTeamId.get(t.id) ?? null,
      projectTitle: t.projectTitle,
      description: t.description,
      createdAt: t.createdAt,
      memberCount: memberCountByTeam.get(t.id) ?? 0,
      deliverableSubmitted: deliverableSubmittedByTeam.get(t.id) ?? 0,
      deliverableTotal: deliverableTotalByTeam.get(t.id) ?? 0,
      reviewerAssignmentCount: reviewerAssignmentCountByTeam.get(t.id) ?? 0,
    }));

    const hasPrevPage = page > 1;

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  /** Distinct non-empty school names for admin filters (e.g. judging teams tab). */
  static async getDistinctTeamSchools(): Promise<string[]> {
    const rows = await db.team.findMany({
      select: { school: true },
      distinct: ["school"],
      orderBy: { school: "asc" },
    });
    return rows.map((r) => r.school?.trim()).filter((s): s is string => Boolean(s));
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
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                role: true,
                school: true,
              },
            },
          },
        },
        deliverables: {
          include: {
            template: {
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                customType: true,
                contentType: true,
                dueDate: true,
                required: true,
              },
            },
          },
          orderBy: { submittedAt: "desc" },
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
   * Admin-create a team: pick a lead, optional members, auto-scaffold deliverables.
   */
  static async adminCreateTeam(input: {
    name: string;
    school: string;
    projectTitle?: string;
    description?: string;
    leadUserId: string;
    memberUserIds?: string[];
  }) {
    const { name, school, projectTitle, description, leadUserId, memberUserIds = [] } = input;

    const lead = await db.user.findUnique({ where: { id: leadUserId }, select: { id: true } });
    if (!lead) throw new Error("Lead user not found");

    const existingMembership = await db.teamMember.findFirst({
      where: { userId: leadUserId },
      select: { teamId: true, team: { select: { name: true } } },
    });
    if (existingMembership) {
      throw new Error(`Lead is already a member of team "${existingMembership.team.name}"`);
    }

    const uniqueMembers = [...new Set(memberUserIds)].filter((id) => id !== leadUserId);

    for (const uid of uniqueMembers) {
      const u = await db.user.findUnique({ where: { id: uid }, select: { id: true } });
      if (!u) throw new Error(`Member user ${uid} not found`);
      const m = await db.teamMember.findFirst({
        where: { userId: uid },
        select: { teamId: true, team: { select: { name: true } } },
      });
      if (m) throw new Error(`User ${uid} is already a member of team "${m.team.name}"`);
    }

    const team = await db.team.create({
      data: {
        name,
        school,
        projectTitle: projectTitle || null,
        description: description || null,
        members: {
          create: [
            { userId: leadUserId, role: TeamRole.LEAD },
            ...uniqueMembers.map((uid) => ({ userId: uid, role: TeamRole.MEMBER })),
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, profilePhoto: true },
            },
          },
        },
      },
    });

    const templates = await db.deliverableTemplate.findMany();
    if (templates.length > 0) {
      await db.teamDeliverable.createMany({
        data: templates.map((t) => ({
          teamId: team.id,
          templateId: t.id,
          type: t.type,
          customType: t.customType,
          contentType: t.contentType,
          content: "",
        })),
      });
    }

    return team;
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

  static async sendTicCommunityWelcomeToUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, status: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new Error("Cannot send email to a suspended user");
    }
    await sendTicCommunityWelcomeEmail(user.email, user.firstName);
    return { sent: true as const, email: user.email };
  }

  /** Sends the TIC Community welcome email to all active, verified users (batched with small delays). */
  static async broadcastTicCommunityWelcome() {
    const users = await db.user.findMany({
      where: {
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      select: { email: true, firstName: true },
    });
    let sent = 0;
    let failed = 0;
    for (const u of users) {
      try {
        await sendTicCommunityWelcomeEmail(u.email, u.firstName);
        sent++;
        await new Promise((r) => setTimeout(r, 150));
      } catch {
        failed++;
      }
    }
    return { sent, failed, total: users.length };
  }
}
