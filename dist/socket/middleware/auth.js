import { Socket } from "socket.io";
import { verifyAccessToken } from "../../shared/utils/jwt.js";
import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
/**
 * Socket.io authentication middleware
 * Verifies JWT token from handshake auth or query
 */
export const socketAuthMiddleware = async (socket, next) => {
    try {
        logger.info({ socketId: socket.id }, "🔐 [SOCKET AUTH] Authenticating new socket connection");
        // Get token from handshake auth or query
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            logger.warn({ socketId: socket.id }, "❌ [SOCKET AUTH] No authentication token provided");
            return next(new Error("Authentication token required"));
        }
        logger.info({ socketId: socket.id }, "🔍 [SOCKET AUTH] Token found, verifying...");
        // Verify token
        const decoded = verifyAccessToken(token);
        if (!decoded || !decoded.userId) {
            logger.warn({ socketId: socket.id, decoded }, "❌ [SOCKET AUTH] Invalid or malformed token");
            return next(new Error("Invalid authentication token"));
        }
        logger.info({ socketId: socket.id, userId: decoded.userId }, "✅ [SOCKET AUTH] Token verified, fetching user from database");
        // Fetch user from database to get full details
        const user = await db.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        if (!user) {
            logger.warn({ socketId: socket.id, userId: decoded.userId }, "❌ [SOCKET AUTH] User not found in database");
            return next(new Error("User not found"));
        }
        // Attach user info to socket
        socket.userId = decoded.userId;
        socket.user = {
            id: user.id,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`,
            role: user.role,
        };
        logger.info({
            socketId: socket.id,
            userId: decoded.userId,
            email: user.email,
            fullName: `${user.firstName} ${user.lastName}`
        }, "✅ [SOCKET AUTH] Authentication successful");
        next();
    }
    catch (error) {
        logger.error({
            error,
            socketId: socket.id,
            errorMessage: error.message
        }, "💥 [SOCKET AUTH] Authentication failed");
        next(new Error("Authentication failed"));
    }
};
//# sourceMappingURL=auth.js.map