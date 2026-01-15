import type { Server } from "socket.io";
import type { FeedCategory } from "@prisma/client";
/**
 * Setup feed WebSocket handlers
 */
export declare function setupFeedSocket(io: Server): import("socket.io").Namespace<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
/**
 * Emit feed events (called from service layer)
 */
export declare class FeedSocketEmitter {
    private static io;
    static initialize(io: Server): void;
    /**
     * Broadcast new post created
     */
    static emitPostCreated(post: any): Promise<void>;
    /**
     * Broadcast post updated
     */
    static emitPostUpdated(postId: string, updates: any, category: FeedCategory): Promise<void>;
    /**
     * Broadcast post deleted
     */
    static emitPostDeleted(postId: string, category: FeedCategory): Promise<void>;
    /**
     * Broadcast post pinned/unpinned
     */
    static emitPostPinned(postId: string, isPinned: boolean, category: FeedCategory): Promise<void>;
    /**
     * Broadcast post liked
     */
    static emitPostLiked(postId: string, userId: string, userName: string, isLiked: boolean, likesCount: number): Promise<void>;
    /**
     * Broadcast comment created
     */
    static emitCommentCreated(postId: string, comment: any, commentsCount: number): Promise<void>;
    /**
     * Broadcast comment updated
     */
    static emitCommentUpdated(postId: string, commentId: string, content: string, updatedAt: Date): Promise<void>;
    /**
     * Broadcast comment deleted
     */
    static emitCommentDeleted(postId: string, commentId: string, commentsCount: number): Promise<void>;
    /**
     * Broadcast comment liked
     */
    static emitCommentLiked(postId: string, commentId: string, userId: string, isLiked: boolean, likesCount: number): Promise<void>;
    /**
     * Broadcast view count updated
     */
    static emitViewIncremented(postId: string, viewsCount: number): Promise<void>;
}
//# sourceMappingURL=socket.d.ts.map