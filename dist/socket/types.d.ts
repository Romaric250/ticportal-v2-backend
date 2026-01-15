import { Socket } from "socket.io";
export interface AuthenticatedSocket extends Socket {
    userId?: string;
    user?: {
        id: string;
        email: string;
        fullName: string;
    };
}
export interface TeamChatMessage {
    teamId: string;
    message: string;
    attachments?: string[];
}
export interface TeamTypingIndicator {
    teamId: string;
    isTyping: boolean;
}
export interface TeamJoinRoom {
    teamId: string;
}
export interface TeamLeaveRoom {
    teamId: string;
}
export interface MessageDeliveryReceipt {
    messageId: string;
    teamId: string;
    status: "delivered" | "read";
}
export interface UserOnlineStatus {
    userId: string;
    status: "online" | "offline" | "away";
    lastSeen?: Date;
}
export interface ServerToClientEvents {
    "team:message": (data: {
        id: string;
        teamId: string;
        userId: string;
        userName: string;
        message: string;
        attachments?: string[];
        createdAt: string;
    }) => void;
    "team:typing": (data: {
        teamId: string;
        userId: string;
        userName: string;
        isTyping: boolean;
    }) => void;
    "team:member:online": (data: {
        teamId: string;
        userId: string;
        status: "online" | "offline" | "away";
    }) => void;
    "team:message:receipt": (data: {
        messageId: string;
        teamId: string;
        userId: string;
        status: "delivered" | "read";
    }) => void;
    "team:updated": (data: {
        teamId: string;
        name?: string;
        projectTitle?: string;
        description?: string;
    }) => void;
    "team:member:added": (data: {
        teamId: string;
        userId: string;
        userName: string;
        role: string;
    }) => void;
    "team:member:removed": (data: {
        teamId: string;
        userId: string;
        userName: string;
    }) => void;
    "team:member:role:updated": (data: {
        teamId: string;
        userId: string;
        userName: string;
        newRole: string;
    }) => void;
    "feed:post:created": (data: {
        post: any;
    }) => void;
    "feed:post:updated": (data: {
        postId: string;
        updates: any;
    }) => void;
    "feed:post:deleted": (data: {
        postId: string;
    }) => void;
    "feed:post:pinned": (data: {
        postId: string;
        isPinned: boolean;
    }) => void;
    "feed:post:liked": (data: {
        postId: string;
        userId: string;
        userName: string;
        isLiked: boolean;
        likesCount: number;
    }) => void;
    "feed:comment:created": (data: {
        postId: string;
        comment: any;
        commentsCount: number;
    }) => void;
    "feed:comment:updated": (data: {
        postId: string;
        commentId: string;
        content: string;
        updatedAt: string;
    }) => void;
    "feed:comment:deleted": (data: {
        postId: string;
        commentId: string;
        commentsCount: number;
    }) => void;
    "feed:comment:liked": (data: {
        postId: string;
        commentId: string;
        userId: string;
        isLiked: boolean;
        likesCount: number;
    }) => void;
    "feed:view:incremented": (data: {
        postId: string;
        viewsCount: number;
    }) => void;
    "feed:typing:comment": (data: {
        postId: string;
        userId: string;
        userName: string;
        isTyping: boolean;
    }) => void;
    "feed:error": (data: {
        message: string;
        code?: string;
    }) => void;
    error: (data: {
        message: string;
    }) => void;
}
export interface ClientToServerEvents {
    "team:join": (data: TeamJoinRoom) => void;
    "team:leave": (data: TeamLeaveRoom) => void;
    "team:message:send": (data: TeamChatMessage) => void;
    "team:typing:start": (data: {
        teamId: string;
    }) => void;
    "team:typing:stop": (data: {
        teamId: string;
    }) => void;
    "team:message:delivered": (data: {
        messageId: string;
        teamId: string;
    }) => void;
    "team:message:read": (data: {
        messageId: string;
        teamId: string;
    }) => void;
    "feed:join": (data: {
        category?: string;
    }) => void;
    "feed:leave": () => void;
    "feed:typing:comment": (data: {
        postId: string;
        isTyping: boolean;
    }) => void;
    "feed:post:view": (data: {
        postId: string;
    }) => void;
}
//# sourceMappingURL=types.d.ts.map