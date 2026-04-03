import { UserRole } from "@prisma/client";
export type CommunityMessageDTO = {
    id: string;
    channelId: string;
    body: string;
    imageUrls: string[];
    parentId: string | null;
    isPinned: boolean;
    pinnedAt: string | null;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        profilePhoto: string | null;
    };
    replyCount: number;
};
export declare class CommunityService {
    static isAdminRole(role: unknown): boolean;
    static listRootMessages(limit?: number): Promise<{
        pinned: CommunityMessageDTO[];
        messages: CommunityMessageDTO[];
    }>;
    static countReplies(rootId: string): Promise<number>;
    static listThread(rootId: string): Promise<CommunityMessageDTO[]>;
    static validatePayload(body: string, imageUrls: string[]): {
        ok: true;
    } | {
        ok: false;
        error: string;
    };
    static createMessage(userId: string, userRole: UserRole, input: {
        body: string;
        imageUrls?: string[];
        parentId?: string | null;
    }): Promise<{
        ok: true;
        message: CommunityMessageDTO;
    } | {
        ok: false;
        error: string;
        status?: number;
    }>;
    static setPinned(adminUserId: string, adminRole: UserRole, messageId: string, pinned: boolean): Promise<{
        ok: true;
        message: CommunityMessageDTO;
    } | {
        ok: false;
        error: string;
        status?: number;
    }>;
    static updateMessage(userId: string, messageId: string, input: {
        body: string;
        imageUrls?: string[];
    }): Promise<{
        ok: true;
        message: CommunityMessageDTO;
    } | {
        ok: false;
        error: string;
        status?: number;
    }>;
    static deleteMessage(userId: string, userRole: UserRole, messageId: string): Promise<{
        ok: true;
        deletedId: string;
        parentId: string | null;
    } | {
        ok: false;
        error: string;
        status?: number;
    }>;
    /**
     * Admin-only: delete many channel messages in one transaction.
     * For selected roots, all replies are removed first (including replies not selected).
     */
    static bulkDeleteMessages(adminRole: UserRole, ids: string[]): Promise<{
        ok: true;
        deletedIds: string[];
    } | {
        ok: false;
        error: string;
        status?: number;
    }>;
    static savePushSubscription(userId: string, sub: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }): Promise<void>;
    static removePushSubscription(userId: string, endpoint: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map