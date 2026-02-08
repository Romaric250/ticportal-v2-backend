import { UserRole, UserStatus } from "@prisma/client";
export declare class AdminService {
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
    }): Promise<{
        users: {
            affiliation: string | null;
            jurisdiction: string | null;
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
    }>;
    /**
     * Create user (admin)
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
    }>;
    /**
     * Delete user
     */
    static deleteUser(userId: string): Promise<void>;
    /**
     * Get all teams with filters
     */
    static getTeams(filters: {
        page?: number;
        limit?: number;
        school?: string;
        status?: string;
        search?: string;
    }): Promise<{
        teams: ({
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get team by ID
     */
    static getTeamById(teamId: string): Promise<{
        members: ({
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
}
//# sourceMappingURL=service.d.ts.map