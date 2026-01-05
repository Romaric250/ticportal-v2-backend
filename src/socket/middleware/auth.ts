import { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
import { verifyAccessToken } from "../../shared/utils/jwt";
import { logger } from "../../shared/utils/logger";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

/**
 * Socket.io authentication middleware
 * Verifies JWT token from handshake auth or query
 */
export const socketAuthMiddleware = async (
  socket: AuthenticatedSocket,
  next: (err?: ExtendedError) => void
) => {
  try {
    // Get token from handshake auth or query
    const token =
      socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Verify token
    const decoded = verifyAccessToken(token as string);

    if (!decoded || !decoded.userId) {
      return next(new Error("Invalid authentication token"));
    }

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.user = {
      id: decoded.userId,
      email: decoded.email,
      fullName: decoded.fullName,
    };

    logger.info(
      { userId: decoded.userId, socketId: socket.id },
      "Socket authenticated"
    );

    next();
  } catch (error) {
    logger.error({ error }, "Socket authentication failed");
    next(new Error("Authentication failed"));
  }
};
