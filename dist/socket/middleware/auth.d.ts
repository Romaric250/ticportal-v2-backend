import { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
import type { UserRole } from "@prisma/client";
export interface AuthenticatedSocket extends Socket {
    userId?: string;
    user?: {
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
    };
}
/**
 * Socket.io authentication middleware
 * Verifies JWT token from handshake auth or query
 */
export declare const socketAuthMiddleware: (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map