import { logger } from "../../shared/utils/logger";
export const registerNotificationHandlers = (io, socket) => {
    logger.info({ socketId: socket.id, userId: socket.userId }, "📬 [SOCKET] Notification handlers registered");
    // Join user's personal notification room
    const notificationRoom = `notifications:${socket.userId}`;
    socket.join(notificationRoom);
    logger.info({ socketId: socket.id, userId: socket.userId, room: notificationRoom }, "✅ [SOCKET] User joined notification room");
};
/**
 * Emit notification to a specific user
 */
export const emitNotification = (io, userId, notification) => {
    const room = `notifications:${userId}`;
    io.to(room).emit("notification:new", notification);
    logger.info({ userId, notificationId: notification.id, room }, "📢 [SOCKET] Notification emitted to user");
};
/**
 * Emit unread count update
 */
export const emitUnreadCountUpdate = (io, userId, count) => {
    const room = `notifications:${userId}`;
    io.to(room).emit("notification:unread-count", { count });
    logger.info({ userId, count, room }, "📢 [SOCKET] Unread count update emitted");
};
//# sourceMappingURL=notifications.js.map