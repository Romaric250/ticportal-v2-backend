import { Server } from "socket.io";
import type { AuthenticatedSocket } from "../types";
/**
 * Register team chat event handlers
 */
export declare const registerTeamChatHandlers: (io: Server, socket: AuthenticatedSocket) => void;
/**
 * Emit team update event to all team members
 */
export declare const emitTeamUpdate: (io: Server, teamId: string, data: {
    name?: string;
    projectTitle?: string;
    description?: string;
}) => void;
/**
 * Emit team member added event
 */
export declare const emitTeamMemberAdded: (io: Server, teamId: string, data: {
    userId: string;
    userName: string;
    role: string;
}) => void;
/**
 * Emit team member removed event
 */
export declare const emitTeamMemberRemoved: (io: Server, teamId: string, data: {
    userId: string;
    userName: string;
}) => void;
/**
 * Emit team member role updated event
 */
export declare const emitTeamMemberRoleUpdated: (io: Server, teamId: string, data: {
    userId: string;
    userName: string;
    newRole: string;
}) => void;
//# sourceMappingURL=teamChat.d.ts.map