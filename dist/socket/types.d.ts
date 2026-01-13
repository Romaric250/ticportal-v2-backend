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
}
//# sourceMappingURL=types.d.ts.map