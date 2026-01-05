import { Server } from "socket.io";
import type { AuthenticatedSocket } from "../types";
import { TeamService } from "../../modules/teams/service";
import { logger } from "../../shared/utils/logger";
import { db } from "../../config/database";

/**
 * Register team chat event handlers
 */
export const registerTeamChatHandlers = (io: Server, socket: AuthenticatedSocket) => {
  const teamService = new TeamService();

  /**
   * Join a team room
   */
  socket.on("team:join", async ({ teamId }) => {
    try {
      if (!socket.userId) {
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      // Verify user is a team member
      const isMember = await teamService.isTeamMember(teamId, socket.userId);
      if (!isMember) {
        socket.emit("error", { message: "Not a team member" });
        return;
      }

      // Join the team room
      await socket.join(`team:${teamId}`);

      // Notify team members that user is online
      socket.to(`team:${teamId}`).emit("team:member:online", {
        teamId,
        userId: socket.userId,
        status: "online",
      });

      logger.info(
        { userId: socket.userId, teamId, socketId: socket.id },
        "User joined team room"
      );
    } catch (error) {
      logger.error({ error, teamId }, "Error joining team room");
      socket.emit("error", { message: "Failed to join team room" });
    }
  });

  /**
   * Leave a team room
   */
  socket.on("team:leave", async ({ teamId }) => {
    try {
      if (!socket.userId) return;

      // Leave the team room
      await socket.leave(`team:${teamId}`);

      // Notify team members that user is offline
      socket.to(`team:${teamId}`).emit("team:member:online", {
        teamId,
        userId: socket.userId,
        status: "offline",
      });

      logger.info(
        { userId: socket.userId, teamId, socketId: socket.id },
        "User left team room"
      );
    } catch (error) {
      logger.error({ error, teamId }, "Error leaving team room");
    }
  });

  /**
   * Send a team message
   */
  socket.on("team:message:send", async ({ teamId, message, attachments }) => {
    try {
      if (!socket.userId || !socket.user) {
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      // Verify user is a team member
      const isMember = await teamService.isTeamMember(teamId, socket.userId);
      if (!isMember) {
        socket.emit("error", { message: "Not a team member" });
        return;
      }

      // Save message to database
      const chatMessage = await teamService.sendTeamChatMessage(
        teamId,
        socket.userId,
        message,
        attachments
      );

      // Broadcast message to team room
      io.to(`team:${teamId}`).emit("team:message", {
        id: chatMessage.id,
        teamId: chatMessage.teamId,
        userId: chatMessage.senderId,
        userName: socket.user.fullName,
        message: chatMessage.message,
        attachments: chatMessage.attachments,
        createdAt: chatMessage.createdAt.toISOString(),
      });

      logger.info(
        { userId: socket.userId, teamId, messageId: chatMessage.id },
        "Team message sent"
      );
    } catch (error) {
      logger.error({ error, teamId }, "Error sending team message");
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  /**
   * Typing indicator - start
   */
  socket.on("team:typing:start", async ({ teamId }) => {
    try {
      if (!socket.userId || !socket.user) return;

      // Verify user is a team member
      const isMember = await teamService.isTeamMember(teamId, socket.userId);
      if (!isMember) return;

      // Broadcast typing indicator to team room (except sender)
      socket.to(`team:${teamId}`).emit("team:typing", {
        teamId,
        userId: socket.userId,
        userName: socket.user.fullName,
        isTyping: true,
      });
    } catch (error) {
      logger.error({ error, teamId }, "Error broadcasting typing indicator");
    }
  });

  /**
   * Typing indicator - stop
   */
  socket.on("team:typing:stop", async ({ teamId }) => {
    try {
      if (!socket.userId || !socket.user) return;

      // Verify user is a team member
      const isMember = await teamService.isTeamMember(teamId, socket.userId);
      if (!isMember) return;

      // Broadcast typing indicator to team room (except sender)
      socket.to(`team:${teamId}`).emit("team:typing", {
        teamId,
        userId: socket.userId,
        userName: socket.user.fullName,
        isTyping: false,
      });
    } catch (error) {
      logger.error({ error, teamId }, "Error broadcasting typing indicator");
    }
  });

  /**
   * Message delivered receipt
   */
  socket.on("team:message:delivered", async ({ messageId, teamId }) => {
    try {
      if (!socket.userId) return;

      // Broadcast delivery receipt to team room
      socket.to(`team:${teamId}`).emit("team:message:receipt", {
        messageId,
        teamId,
        userId: socket.userId,
        status: "delivered",
      });
    } catch (error) {
      logger.error({ error, messageId }, "Error sending delivery receipt");
    }
  });

  /**
   * Message read receipt
   */
  socket.on("team:message:read", async ({ messageId, teamId }) => {
    try {
      if (!socket.userId) return;

      // Broadcast read receipt to team room
      socket.to(`team:${teamId}`).emit("team:message:receipt", {
        messageId,
        teamId,
        userId: socket.userId,
        status: "read",
      });
    } catch (error) {
      logger.error({ error, messageId }, "Error sending read receipt");
    }
  });

  /**
   * Handle disconnect
   */
  socket.on("disconnect", async () => {
    try {
      if (!socket.userId) return;

      // Get all team rooms the user was in
      const rooms = Array.from(socket.rooms).filter((room) =>
        room.startsWith("team:")
      );

      // Notify all team rooms that user is offline
      for (const room of rooms) {
        const teamId = room.replace("team:", "");
        socket.to(room).emit("team:member:online", {
          teamId,
          userId: socket.userId,
          status: "offline",
        });
      }

      logger.info(
        { userId: socket.userId, socketId: socket.id },
        "User disconnected from socket"
      );
    } catch (error) {
      logger.error({ error }, "Error handling disconnect");
    }
  });
};

/**
 * Emit team update event to all team members
 */
export const emitTeamUpdate = (
  io: Server,
  teamId: string,
  data: {
    name?: string;
    projectTitle?: string;
    description?: string;
  }
) => {
  io.to(`team:${teamId}`).emit("team:updated", {
    teamId,
    ...data,
  });
};

/**
 * Emit team member added event
 */
export const emitTeamMemberAdded = (
  io: Server,
  teamId: string,
  data: {
    userId: string;
    userName: string;
    role: string;
  }
) => {
  io.to(`team:${teamId}`).emit("team:member:added", {
    teamId,
    ...data,
  });
};

/**
 * Emit team member removed event
 */
export const emitTeamMemberRemoved = (
  io: Server,
  teamId: string,
  data: {
    userId: string;
    userName: string;
  }
) => {
  io.to(`team:${teamId}`).emit("team:member:removed", {
    teamId,
    ...data,
  });
};

/**
 * Emit team member role updated event
 */
export const emitTeamMemberRoleUpdated = (
  io: Server,
  teamId: string,
  data: {
    userId: string;
    userName: string;
    newRole: string;
  }
) => {
  io.to(`team:${teamId}`).emit("team:member:role:updated", {
    teamId,
    ...data,
  });
};
