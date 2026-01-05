import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/auth";
import { registerTeamChatHandlers } from "./events/teamChat";
import { logger } from "../shared/utils/logger";
import type { AuthenticatedSocket, ServerToClientEvents, ClientToServerEvents } from "./types";

/**
 * Initialize Socket.io with authentication and event handlers
 */
export const initializeSocket = (io: Server) => {
  logger.info("🚀 [SOCKET] Initializing Socket.io server");

  // Apply authentication middleware
  io.use(socketAuthMiddleware);
  logger.info("✅ [SOCKET] Authentication middleware applied");

  // Handle connections
  io.on("connection", (socket: AuthenticatedSocket) => {
    logger.info(
      {
        socketId: socket.id,
        userId: socket.userId,
        userName: socket.user?.fullName,
        email: socket.user?.email,
      },
      "🟢 [SOCKET] New client connected successfully"
    );

    // Register team chat event handlers
    registerTeamChatHandlers(io, socket);
    logger.info(
      { socketId: socket.id, userId: socket.userId },
      "✅ [SOCKET] Team chat handlers registered for client"
    );

    // Debug: Log ALL events received from client
    socket.onAny((eventName, ...args) => {
      logger.info(
        { 
          socketId: socket.id, 
          userId: socket.userId, 
          eventName, 
          args,
          userName: socket.user?.fullName 
        },
        "🎯 [SOCKET DEBUG] Event received from client"
      );
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

  logger.info("✅ [SOCKET] Socket.io initialized with team chat handlers");
};

// Export event emitters for use in controllers
export {
  emitTeamUpdate,
  emitTeamMemberAdded,
  emitTeamMemberRemoved,
  emitTeamMemberRoleUpdated,
} from "./events/teamChat";
