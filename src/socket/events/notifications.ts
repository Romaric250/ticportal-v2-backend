import type { Server } from "socket.io";
import type { AuthenticatedSocket } from "../types";
import { logger } from "../../shared/utils/logger";

export const registerNotificationHandlers = (io: Server, socket: AuthenticatedSocket) => {
  logger.info(
    { socketId: socket.id, userId: socket.userId },
    "📬 [SOCKET] Notification handlers registered"
  );

  // Join user's personal notification room
  const notificationRoom = `notifications:${socket.userId}`;
  socket.join(notificationRoom);

  logger.info(
    { socketId: socket.id, userId: socket.userId, room: notificationRoom },
    "✅ [SOCKET] User joined notification room"
  );
};

/**
 * Emit notification to a specific user
 */
export const emitNotification = (io: Server, userId: string, notification: any) => {
  const room = `notifications:${userId}`;
  
  io.to(room).emit("notification:new", notification);
  
  logger.info(
    { userId, notificationId: notification.id, room },
    "📢 [SOCKET] Notification emitted to user"
  );
};

/**
 * Emit unread count update
 */
export const emitUnreadCountUpdate = (io: Server, userId: string, count: number) => {
  const room = `notifications:${userId}`;
  
  io.to(room).emit("notification:unread-count", { count });
  
  logger.info(
    { userId, count, room },
    "📢 [SOCKET] Unread count update emitted"
  );
};
