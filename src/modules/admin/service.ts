import { db } from "../../config/database";
import type { Prisma } from "@prisma/client";
import { UserRole, UserStatus, TeamRole } from "@prisma/client";

export class AdminService {
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

    if (filters.jurisdiction) {
      where.region = { contains: filters.jurisdiction, mode: "insensitive" };
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
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ]);

    const formattedUsers = users.map((user) => ({
      ...user,
      affiliation: user.teamMembers[0]?.team.name || null,
      jurisdiction: user.region,
    }));

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
    const password = data.password || Math.random().toString(36).slice(-8);
    
    // Hash password
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // TODO: Send email with credentials
    // TODO: Award 10 points for account creation

    return user;
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
   * Delete user
   */
  static async deleteUser(userId: string) {
    await db.user.delete({
      where: { id: userId },
    });
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
