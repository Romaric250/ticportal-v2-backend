import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/auth";
import { registerTeamChatHandlers } from "./events/teamChat";
import { logger } from "../shared/utils/logger";
import type { AuthenticatedSocket, ServerToClientEvents, ClientToServerEvents } from "./types";

/**
 * Initialize Socket.io with authentication and event handlers
 */
export const initializeSocket = (io: Server) => {
  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  // Handle connections
  io.on("connection", (socket: AuthenticatedSocket) => {
    logger.info(
      {
        socketId: socket.id,
        userId: socket.userId,
        userName: socket.user?.fullName,
      },
      "Socket connected"
    );

    // Register team chat event handlers
    registerTeamChatHandlers(io, socket);

    // Handle generic errors
    socket.on("error", (error) => {
      logger.error({ error, socketId: socket.id }, "Socket error");
    });
  });

  logger.info("Socket.io initialized with team chat handlers");
};

// Export event emitters for use in controllers
export {
  emitTeamUpdate,
  emitTeamMemberAdded,
  emitTeamMemberRemoved,
  emitTeamMemberRoleUpdated,
} from "./events/teamChat";
