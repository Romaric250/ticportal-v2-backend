import { UserRole, UserStatus } from "@prisma/client";
export declare class AdminService {
    /** Normalize region names to consolidate variants (North West→Northwest, Center→Centre) */
    private static normalizeRegionName;
    private static readonly MANUAL_PAYMENT_METHODS;
    private static readonly ONLINE_PAYMENT_METHODS;
    /**
     * Team IDs with at least `min` required deliverables submitted (same rules as list rows: template.required !== false).
     * Uses DB-side aggregation — avoids loading every submitted row into memory (MongoDB full scan / OOM).
     */
    private static teamIdsWithAtLeastNRequiredSubmitted;
    /**
     * Get students by region with paid counts.
     * Optional `paymentChannel`: `all` | `manual` | `online` — `paid` counts students with at least one confirmed payment in that channel.
     */
    static getUsersByRegionStats(params?: {
        paymentChannel?: "all" | "manual" | "online";
    }): Promise<{
        region: string;
        total: number;
        paid: number;
        paidManual: number;
        paidOnline: number;
        paymentChannel: "online" | "all" | "manual";
    }[]>;
    /**
     * Get dashboard statistics
     */
    static getDashboardStats(): Promise<{
        totalUsers: number;
        pendingApprovals: number;
        mentorsAndLeads: number;
        unassignedJudges: number;
        totalUsersChange: number;
    }>;
    /**
     * Get detailed dashboard statistics
     */
    static getDetailedDashboardStats(): Promise<{
        usersByRole: {
            role: import(".prisma/client").$Enums.UserRole;
            count: number;
        }[];
        usersByStatus: {
            status: import(".prisma/client").$Enums.UserStatus;
            count: number;
        }[];
        usersOverTime: {
            date: string;
            users: number;
        }[];
        teamsCount: number;
        activeTeams: number;
    }>;
    /**
     * Get users with pagination and filters
     */
    static getUsers(filters: {
        page?: number;
        limit?: number;
        role?: UserRole;
        jurisdiction?: string;
        status?: UserStatus;
        search?: string;
        paymentStatus?: "paid" | "not_paid" | "manual_paid";
    }): Promise<{
        users: {
            affiliation: string | null;
            jurisdiction: string | null;
            hasPaid: boolean | undefined;
            isManualChannelPaid: boolean | undefined;
            isManualSubscription: boolean | undefined;
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
            school: string | null;
            region: string | null;
            isVerified: boolean;
            lastLogin: Date | null;
            teamMembers: ({
                team: {
                    name: string;
                };
            } & {
                userId: string;
                id: string;
                role: import(".prisma/client").$Enums.TeamRole;
                teamId: string;
                joinedAt: Date;
            })[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get single user by ID
     */
    static getUserById(userId: string): Promise<{
        teamMembers: ({
            team: {
                id: string;
                name: string;
            };
        } & {
            userId: string;
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        email: string;
        username: string | null;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string;
        lastName: string;
        bio: string | null;
        phone: string | null;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        region: string | null;
        gradDate: Date | null;
        isVerified: boolean;
        lastLogin: Date | null;
        squadId: string | null;
        updatedAt: Date;
        isReviewer: boolean;
    }>;
    /**
     * Create user (admin)
     * Returns user and plainPassword for admin to copy (when password was auto-generated)
     */
    static createUser(data: {
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        school?: string;
        region?: string;
        password?: string;
    }): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            bio: string | null;
            phone: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
            updatedAt: Date;
            isReviewer: boolean;
        };
        plainPassword: string | undefined;
    }>;
    /**
     * Admin: Send OTP to email for verification before creating new user
     * Email may not belong to an existing user
     */
    static sendVerificationOtp(email: string): Promise<{
        message: string;
    }>;
    /**
     * Admin: Verify OTP and create user
     * Returns user and plainPassword for admin to copy
     */
    static verifyAndCreateUser(data: {
        email: string;
        code: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        school?: string;
        region?: string;
        password?: string;
    }): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            bio: string | null;
            phone: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
            updatedAt: Date;
            isReviewer: boolean;
        };
        plainPassword: string | undefined;
    }>;
    /**
     * Update user
     */
    static updateUser(userId: string, data: {
        role?: UserRole;
        status?: UserStatus;
        school?: string;
        region?: string;
        isVerified?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        username: string | null;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string;
        lastName: string;
        bio: string | null;
        phone: string | null;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        region: string | null;
        gradDate: Date | null;
        isVerified: boolean;
        lastLogin: Date | null;
        squadId: string | null;
        updatedAt: Date;
        isReviewer: boolean;
    }>;
    /**
     * Bulk delete users
     */
    static deleteUsers(userIds: string[]): Promise<{
        deleted: number;
        failed: Array<{
            userId: string;
            error: string;
        }>;
    }>;
    /**
     * Delete user
     * Must delete all records that reference the user (no onDelete: Cascade) before deleting.
     * Runs without transaction to avoid MongoDB server monitor timeout on long bulk deletes.
     * Includes retry logic for transient connection errors.
     */
    static deleteUser(userId: string): Promise<void>;
    static getTeams(filters: {
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
    }): Promise<{
        teams: {
            id: string;
            name: string;
            school: string;
            region: string | null;
            projectTitle: string | null;
            description: string | null;
            createdAt: Date;
            memberCount: number;
            deliverableSubmitted: number;
            deliverableTotal: number;
            reviewerAssignmentCount: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number | null;
            totalPages: number | null;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    /** Distinct non-empty school names for admin filters (e.g. judging teams tab). */
    static getDistinctTeamSchools(): Promise<string[]>;
    /**
     * Get team by ID
     */
    static getTeamById(teamId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
                school: string | null;
            };
        } & {
            userId: string;
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            teamId: string;
            joinedAt: Date;
        })[];
        deliverables: ({
            template: {
                id: string;
                type: import(".prisma/client").$Enums.DeliverableType;
                title: string;
                description: string;
                customType: string | null;
                contentType: import(".prisma/client").$Enums.DeliverableContentType;
                dueDate: Date;
                required: boolean;
            };
        } & {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            description: string | null;
            teamId: string;
            submittedAt: Date;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            content: string;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            feedback: string | null;
            templateId: string;
            submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
            reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        school: string;
        profileImage: string | null;
        projectTitle: string | null;
        description: string | null;
    }>;
    /**
     * Update team (admin override)
     */
    static updateTeam(teamId: string, data: {
        name?: string;
        projectTitle?: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        school: string;
        profileImage: string | null;
        projectTitle: string | null;
        description: string | null;
    }>;
    /**
     * Delete team (admin only)
     */
    static deleteTeam(teamId: string): Promise<void>;
    /**
     * Get team members
     */
    static getTeamMembers(teamId: string): Promise<({
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        userId: string;
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        teamId: string;
        joinedAt: Date;
    })[]>;
    /**
     * Add member to team
     */
    static addTeamMember(teamId: string, userId: string, role?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        userId: string;
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        teamId: string;
        joinedAt: Date;
    }>;
    /**
     * Remove member from team
     */
    static removeTeamMember(teamId: string, userId: string): Promise<void>;
    /**
     * Update team member role
     */
    static updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        userId: string;
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        teamId: string;
        joinedAt: Date;
    }>;
    /**
     * Admin-create a team: pick a lead, optional members, auto-scaffold deliverables.
     */
    static adminCreateTeam(input: {
        name: string;
        school: string;
        projectTitle?: string;
        description?: string;
        leadUserId: string;
        memberUserIds?: string[];
    }): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
            };
        } & {
            userId: string;
            id: string;
            role: import(".prisma/client").$Enums.TeamRole;
            teamId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        school: string;
        profileImage: string | null;
        projectTitle: string | null;
        description: string | null;
    }>;
    /**
     * Get team submissions/projects
     */
    static getTeamSubmissions(teamId: string): Promise<{
        id: string;
        title: string;
        description: string;
        teamId: string;
        hackathonId: string;
        fileUrls: string[];
        submittedAt: Date;
    }[]>;
    static sendTicCommunityWelcomeToUser(userId: string): Promise<{
        sent: true;
        email: string;
    }>;
    /** Sends the TIC Community welcome email to all active, verified users (batched with small delays). */
    static broadcastTicCommunityWelcome(): Promise<{
        sent: number;
        failed: number;
        total: number;
    }>;
}
//# sourceMappingURL=service.d.ts.map