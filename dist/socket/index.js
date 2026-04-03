import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/auth.js";
import { registerTeamChatHandlers } from "./events/teamChat.js";
import { registerNotificationHandlers } from "./events/notifications.js";
import { registerCommunityHandlers } from "./events/community.js";
import { registerSocketServer } from "./ioHolder.js";
import { logger } from "../shared/utils/logger.js";
/**
 * Initialize Socket.io with authentication and event handlers
 */
export const initializeSocket = (io) => {
    registerSocketServer(io);
    logger.info("🚀 [SOCKET] Initializing Socket.io server");
    // Apply authentication middleware
    io.use(socketAuthMiddleware);
    logger.info("✅ [SOCKET] Authentication middleware applied");
    // Handle connections
    io.on("connection", (socket) => {
        logger.info({
            socketId: socket.id,
            userId: socket.userId,
            userName: socket.user?.fullName,
            email: socket.user?.email,
        }, "🟢 [SOCKET] New client connected successfully");
        // Register handlers
        registerTeamChatHandlers(io, socket);
        registerNotificationHandlers(io, socket);
        registerCommunityHandlers(io, socket);
        logger.info({ socketId: socket.id, userId: socket.userId }, "✅ [SOCKET] Handlers registered for client");
        // Debug: Log ALL events received from client
        socket.onAny((eventName, ...args) => {
            logger.info({
                socketId: socket.id,
                userId: socket.userId,
                eventName,
                args,
                userName: socket.user?.fullName
            }, "🎯 [SOCKET DEBUG] Event received from client");
        });
        // Handle generic errors
        socket.on("error", (error) => {
            logger.error({
                error,
                socketId: socket.id,
                userId: socket.userId,
                userName: socket.user?.fullName
            }, "❌ [SOCKET] Socket error occurred");
        });
    });
    logger.info("✅ [SOCKET] Socket.io initialized with team chat, notifications, and community");
};
// Export event emitters for use in controllers
export { emitTeamUpdate, emitTeamMemberAdded, emitTeamMemberRemoved, emitTeamMemberRoleUpdated, } from "./events/teamChat.js";
export * from "./events/notifications.js";
//# sourceMappingURL=index.js.map