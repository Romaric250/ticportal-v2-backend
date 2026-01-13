import type { CreateNotificationInput } from "./types";
export declare class NotificationService {
    /**
     * Create a new notification
     */
    static createNotification(input: CreateNotificationInput): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        message: string;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        createdAt: Date;
        title: string;
        isRead: boolean;
        readAt: Date | null;
        expiresAt: Date | null;
    }>;
    /**
     * Get all notifications for a user
     */
    static getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            message: string;
            userId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            type: import(".prisma/client").$Enums.NotificationType;
            createdAt: Date;
            title: string;
            isRead: boolean;
            readAt: Date | null;
            expiresAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get unread notification count
     */
    static getUnreadCount(userId: string): Promise<number>;
    /**
     * Mark notification as read (and set expiration to 1 minute)
     */
    static markAsRead(notificationId: string, userId: string): Promise<{
        message: string;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.NotificationType;
        createdAt: Date;
        title: string;
        isRead: boolean;
        readAt: Date | null;
        expiresAt: Date | null;
    }>;
    /**
     * Mark all notifications as read for a user
     */
    static markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    /**
     * Delete expired notifications (called by cron job)
     */
    static cleanupExpiredNotifications(): Promise<number>;
    /**
     * Delete a specific notification
     */
    static deleteNotification(notificationId: string, userId: string): Promise<void>;
    /**
     * Create point milestone notification
     */
    static notifyPointMilestone(userId: string, points: number, reason: string): Promise<void>;
    /**
     * Create points earned notification (10+ points)
     */
    static notifyPointsEarned(userId: string, points: number, reason: string): Promise<void>;
    /**
     * Create team member added notification
     */
    static notifyTeamMemberAdded(userId: string, teamName: string, teamId: string): Promise<void>;
    /**
     * Create team member removed notification
     */
    static notifyTeamMemberRemoved(userId: string, teamName: string): Promise<void>;
    /**
     * Create team role updated notification
     */
    static notifyTeamRoleUpdated(userId: string, teamName: string, newRole: string, teamId: string): Promise<void>;
    /**
     * Create team join request notification (for team leads)
     */
    static notifyTeamJoinRequest(teamLeadId: string, requesterName: string, teamName: string, teamId: string, requestId: string): Promise<void>;
    /**
     * Create team join approved notification
     */
    static notifyTeamJoinApproved(userId: string, teamName: string, teamId: string): Promise<void>;
    /**
     * Create team join rejected notification
     */
    static notifyTeamJoinRejected(userId: string, teamName: string): Promise<void>;
    /**
     * Create mentor assigned notification
     */
    static notifyMentorAssigned(userId: string, mentorName: string, teamName: string, teamId: string): Promise<void>;
    /**
     * Create badge earned notification
     */
    static notifyBadgeEarned(userId: string, badgeName: string, badgeId: string): Promise<void>;
    /**
     * Create hackathon reminder notification
     */
    static notifyHackathonReminder(userId: string, hackathonName: string, hackathonId: string, daysLeft: number): Promise<void>;
    /**
     * Create stage completed notification
     */
    static notifyStageCompleted(userId: string, stageName: string, stageId: string): Promise<void>;
    /**
     * Create quiz passed notification
     */
    static notifyQuizPassed(userId: string, quizName: string, score: number): Promise<void>;
    /**
     * Create login notification
     */
    static notifyLogin(userId: string, deviceInfo?: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map