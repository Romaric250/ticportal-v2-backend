import { Server } from "socket.io";
/**
 * Initialize Socket.io with authentication and event handlers
 */
export declare const initializeSocket: (io: Server) => void;
export { emitTeamUpdate, emitTeamMemberAdded, emitTeamMemberRemoved, emitTeamMemberRoleUpdated, } from "./events/teamChat";
export * from "./events/notifications";
//# sourceMappingURL=index.d.ts.map