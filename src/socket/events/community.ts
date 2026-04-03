import type { Server } from "socket.io";
import { UserRole } from "@prisma/client";
import type { AuthenticatedSocket } from "../types";
import { CommunityService } from "../../modules/community/service";
import { logger } from "../../shared/utils/logger";

const ROOM = "community:global";

function normRole(r: unknown): UserRole {
  if (typeof r !== "string") return r as UserRole;
  return r.replace(/-/g, "_").toUpperCase() as UserRole;
}

/**
 * Global TIC Community — real-time delivery alongside REST.
 */
export const registerCommunityHandlers = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("community:join", async () => {
    try {
      if (!socket.userId) {
        socket.emit("error", { message: "Not authenticated" });
        return;
      }
      await socket.join(ROOM);
      logger.info({ userId: socket.userId, socketId: socket.id }, "[community] joined global room");
      socket.emit("community:joined", { ok: true });
    } catch (e) {
      logger.error({ e, userId: socket.userId }, "[community] join failed");
      socket.emit("error", { message: "Failed to join community" });
    }
  });

  socket.on("community:leave", async () => {
    try {
      await socket.leave(ROOM);
    } catch {
      /* ignore */
    }
  });

  /** Typing indicator — broadcast to others in the global room (Slack-style). */
  socket.on("community:typing", (payload: { parentId?: string | null }) => {
    try {
      if (!socket.userId || !socket.user) return;
      const parentId =
        payload?.parentId === undefined || payload?.parentId === null
          ? null
          : typeof payload.parentId === "string"
            ? payload.parentId
            : null;
      socket.to(ROOM).emit("community:typing", {
        userId: socket.userId,
        label: socket.user.fullName,
        parentId,
      });
    } catch (e) {
      logger.error({ e, userId: socket.userId }, "[community] typing broadcast failed");
    }
  });

  socket.on(
    "community:message:send",
    async (payload: { body?: string; imageUrls?: string[]; parentId?: string | null }) => {
      try {
        if (!socket.userId || !socket.user) {
          socket.emit("error", { message: "Not authenticated" });
          return;
        }
        const role = normRole(socket.user.role);
        const result = await CommunityService.createMessage(socket.userId, role, {
          body: typeof payload?.body === "string" ? payload.body : "",
          imageUrls: Array.isArray(payload?.imageUrls) ? payload.imageUrls : [],
          parentId: payload?.parentId ?? null,
        });
        if (!result.ok) {
          socket.emit("error", { message: result.error });
          return;
        }
        io.to(ROOM).emit("community:message:new", { message: result.message });
        if (result.message.parentId) {
          const count = await CommunityService.countReplies(result.message.parentId);
          io.to(ROOM).emit("community:thread:count", {
            rootId: result.message.parentId,
            replyCount: count,
          });
        }
      } catch (e) {
        logger.error({ e, userId: socket.userId }, "[community] send failed");
        socket.emit("error", { message: "Failed to send message" });
      }
    },
  );
};
