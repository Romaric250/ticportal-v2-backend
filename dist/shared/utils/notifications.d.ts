import type { NotificationType } from "@prisma/client";
/**
 * Send notification to user
 * Creates notification in DB and emits via Socket.io
 */
export declare function sendNotification(data: {
    userId: string;
    type: NotificationType | string;
    title: string;
    message: string;
    metadata?: any;
}): Promise<{
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
 * Send notification to multiple users
 */
export declare function sendNotificationToMultiple(userIds: string[], data: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
}): Promise<{
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
}[]>;
//# sourceMappingURL=notifications.d.ts.map