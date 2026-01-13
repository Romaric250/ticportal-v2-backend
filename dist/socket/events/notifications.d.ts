import type { Server } from "socket.io";
import type { AuthenticatedSocket } from "../types";
export declare const registerNotificationHandlers: (io: Server, socket: AuthenticatedSocket) => void;
/**
 * Emit notification to a specific user
 */
export declare const emitNotification: (io: Server, userId: string, notification: any) => void;
/**
 * Emit unread count update
 */
export declare const emitUnreadCountUpdate: (io: Server, userId: string, count: number) => void;
//# sourceMappingURL=notifications.d.ts.map