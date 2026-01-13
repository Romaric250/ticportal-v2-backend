import { z } from "zod";
import { NotificationType } from "@prisma/client";
export declare const CreateNotificationSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodEnum<{
        TEAM_INVITE: "TEAM_INVITE";
        TEAM_MEMBER_ADDED: "TEAM_MEMBER_ADDED";
        TEAM_MEMBER_REMOVED: "TEAM_MEMBER_REMOVED";
        TEAM_ROLE_UPDATED: "TEAM_ROLE_UPDATED";
        TEAM_MESSAGE: "TEAM_MESSAGE";
        TEAM_JOIN_REQUEST: "TEAM_JOIN_REQUEST";
        TEAM_JOIN_APPROVED: "TEAM_JOIN_APPROVED";
        TEAM_JOIN_REJECTED: "TEAM_JOIN_REJECTED";
        POINTS_EARNED: "POINTS_EARNED";
        POINTS_MILESTONE: "POINTS_MILESTONE";
        BADGE_EARNED: "BADGE_EARNED";
        LEADERBOARD_UPDATE: "LEADERBOARD_UPDATE";
        STAGE_UNLOCKED: "STAGE_UNLOCKED";
        STAGE_COMPLETED: "STAGE_COMPLETED";
        QUIZ_PASSED: "QUIZ_PASSED";
        COURSE_COMPLETED: "COURSE_COMPLETED";
        HACKATHON_UPCOMING: "HACKATHON_UPCOMING";
        HACKATHON_STARTED: "HACKATHON_STARTED";
        HACKATHON_REMINDER: "HACKATHON_REMINDER";
        HACKATHON_SUBMISSION: "HACKATHON_SUBMISSION";
        HACKATHON_RESULT: "HACKATHON_RESULT";
        MENTOR_ASSIGNED: "MENTOR_ASSIGNED";
        MENTOR_REQUEST: "MENTOR_REQUEST";
        MENTOR_SESSION_SCHEDULED: "MENTOR_SESSION_SCHEDULED";
        SYSTEM_ANNOUNCEMENT: "SYSTEM_ANNOUNCEMENT";
        SYSTEM_UPDATE: "SYSTEM_UPDATE";
    }>;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export declare const MarkNotificationReadSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, z.core.$strip>;
export type MarkNotificationReadInput = z.infer<typeof MarkNotificationReadSchema>;
export interface NotificationWithUser {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    expiresAt?: Date;
}
export declare const POINT_MILESTONES: number[];
export declare const isPointMilestone: (points: number) => boolean;
//# sourceMappingURL=types.d.ts.map