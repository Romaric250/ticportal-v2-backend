import type { CreateTeamInput, UpdateTeamInput, AddTeamMemberInput, UpdateTeamMemberRoleInput, SendTeamChatMessageInput, SearchTeamsInput, RequestToJoinTeamInput, HandleJoinRequestInput } from "./types";
export declare class TeamService {
    /**
     * Get all teams with pagination
     */
    static getTeams(page?: number, limit?: number): Promise<{
        teams: ({
            _count: {
                members: number;
                chats: number;
                submissions: number;
            };
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
     * Get a single team by ID
     */
    static getTeamById(teamId: string): Promise<{
        _count: {
            members: number;
            chats: number;
            submissions: number;
        };
        mentorAssignments: ({
            mentor: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
            };
        } & {
            id: string;
            teamId: string;
            startDate: Date;
            endDate: Date | null;
            mentorId: string;
        })[];
        members: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                bio: string | null;
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
        submissions: {
            id: string;
            title: string;
            submittedAt: Date;
            hackathon: {
                level: import(".prisma/client").$Enums.HackathonLevel;
                id: string;
                name: string;
            };
        }[];
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
     * Get teams for a specific user with unread counts
     */
    static getUserTeams(userId: string): Promise<{
        userRole: import(".prisma/client").$Enums.TeamRole;
        joinedAt: Date;
        unreadCount: number;
        _count: {
            members: number;
            chats: number;
        };
        id: string;
        createdAt: Date;
        name: string;
        school: string;
        profileImage: string | null;
        projectTitle: string | null;
        description: string | null;
    }[]>;
    /**
     * Create a new team
     */
    static createTeam(userId: string, input: CreateTeamInput): Promise<{
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
     * Update team details
     */
    static updateTeam(userId: string, teamId: string, input: UpdateTeamInput): Promise<{
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
     * Delete a team
     */
    static deleteTeam(userId: string, teamId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Add a member to a team
     */
    static addTeamMember(inviterId: string, teamId: string, input: AddTeamMemberInput): Promise<{
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
     * Update team member role
     */
    static updateTeamMemberRole(userId: string, teamId: string, memberId: string, input: UpdateTeamMemberRoleInput): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
        team: {
            name: string;
        };
    } & {
        userId: string;
        id: string;
        role: import(".prisma/client").$Enums.TeamRole;
        teamId: string;
        joinedAt: Date;
    }>;
    /**
     * Remove a team member
     */
    static removeTeamMember(userId: string, teamId: string, memberId: string): Promise<{
        success: boolean;
        message: string;
        userId: string;
        userName: string;
    }>;
    /**
     * Get team chat messages
     */
    static getTeamChats(userId: string, teamId: string, page?: number, limit?: number): Promise<{
        chats: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
            };
        } & {
            message: string;
            id: string;
            createdAt: Date;
            attachments: string[];
            teamId: string;
            senderId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Send a team chat message
     */
    static sendTeamChatMessage(teamId: string, userId: string, input: SendTeamChatMessageInput): Promise<{
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        message: string;
        id: string;
        createdAt: Date;
        attachments: string[];
        teamId: string;
        senderId: string;
    }>;
    /**
     * Check if a user is a member of a team
     */
    static isTeamMember(teamId: string, userId: string): Promise<boolean>;
    /**
     * Get unread message count for a user in a team
     */
    static getUnreadMessageCount(teamId: string, userId: string): Promise<number>;
    /**
     * Mark messages as read
     */
    static markMessagesAsRead(teamId: string, userId: string, messageIds?: string[]): Promise<{
        markedCount: number;
    }>;
    /**
     * Get unread counts for all user's teams
     */
    static getUnreadCountsForUserTeams(userId: string): Promise<Record<string, number>>;
    /**
     * Get total unread message count across all teams for a user
     */
    static getTotalUnreadCount(userId: string): Promise<number>;
    /**
     * Search teams by name, school, or project title
     */
    static searchTeams(input: SearchTeamsInput): Promise<{
        teams: ({
            _count: {
                members: number;
                chats: number;
                submissions: number;
            };
            members: ({
                user: {
                    id: string;
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
     * Request to join a team
     */
    static requestToJoinTeam(userId: string, teamId: string, input: RequestToJoinTeamInput): Promise<{
        message: string | null;
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TeamJoinRequestStatus;
        updatedAt: Date;
        teamId: string;
    }>;
    /**
     * Handle join request (accept/reject)
     */
    static handleJoinRequest(userId: string, teamId: string, requestId: string, input: HandleJoinRequestInput): Promise<{
        success: boolean;
        message: string;
        member: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } | {
        success: boolean;
        message: string;
        member?: never;
    }>;
    /**
     * Get pending join requests for a team
     */
    static getTeamJoinRequests(userId: string, teamId: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
            school: string | null;
        };
    } & {
        message: string | null;
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TeamJoinRequestStatus;
        updatedAt: Date;
        teamId: string;
    })[]>;
    /**
     * Get user's own join requests
     */
    static getUserJoinRequests(userId: string): Promise<({
        team: {
            id: string;
            name: string;
            school: string;
            profileImage: string | null;
            projectTitle: string | null;
        };
    } & {
        message: string | null;
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.TeamJoinRequestStatus;
        updatedAt: Date;
        teamId: string;
    })[]>;
}
//# sourceMappingURL=service.d.ts.map