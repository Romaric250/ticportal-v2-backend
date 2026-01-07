import { Server } from "socket.io";
import type { AuthenticatedSocket } from "../types";
import { TeamService } from "../../modules/teams/service";
import { logger } from "../../shared/utils/logger";
import { db } from "../../config/database";

/**
 * Register team chat event handlers
 */
export const registerTeamChatHandlers = (io: Server, socket: AuthenticatedSocket) => {
  /**
   * Join a team room
   */
  socket.on("team:join", async ({ teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, socketId: socket.id, userName: socket.user?.fullName },
        "🔵 [SOCKET] User attempting to join team room"
      );

      if (!socket.userId) {
        logger.warn({ teamId, socketId: socket.id }, "❌ [SOCKET] Join failed: Not authenticated");
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      // Verify user is a team member
      const isMember = await TeamService.isTeamMember(teamId, socket.userId);
      if (!isMember) {
        logger.warn(
          { userId: socket.userId, teamId, socketId: socket.id },
          "❌ [SOCKET] Join failed: Not a team member"
        );
        socket.emit("error", { message: "Not a team member" });
        return;
      }

      // Join the team room
      await socket.join(`team:${teamId}`);

      // Verify the socket actually joined the room
      const roomName = `team:${teamId}`;
      const socketsInRoom = await io.in(roomName).fetchSockets();
      const socketIds = socketsInRoom.map(s => s.id);
      const userIds = socketsInRoom.map(s => (s as any).userId);

      logger.info(
        { 
          userId: socket.userId, 
          teamId, 
          socketId: socket.id, 
          userName: socket.user?.fullName,
          roomName,
          totalSocketsInRoom: socketsInRoom.length,
          socketIds,
          userIds
        },
        "✅ [SOCKET] User successfully joined team room - Room membership verified"
      );

      // Notify team members that user is online
      const onlineStatusPayload = {
        teamId,
        userId: socket.userId,
        status: "online" as const,
      };
      
      socket.to(`team:${teamId}`).emit("team:member:online", onlineStatusPayload);
      
      logger.info(
        { userId: socket.userId, teamId, userName: socket.user?.fullName, payload: onlineStatusPayload },
        "📢 [SOCKET] Broadcasting online status to team"
      );
    } catch (error) {
      logger.error({ error, teamId, userId: socket.userId }, "💥 [SOCKET] Error joining team room");
      socket.emit("error", { message: "Failed to join team room" });
    }
  });

  /**
   * Leave a team room
   */
  socket.on("team:leave", async ({ teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, socketId: socket.id, userName: socket.user?.fullName },
        "🔵 [SOCKET] User attempting to leave team room"
      );

      if (!socket.userId) return;

      // Leave the team room
      await socket.leave(`team:${teamId}`);

      logger.info(
        { userId: socket.userId, teamId, userName: socket.user?.fullName },
        "✅ [SOCKET] User successfully left team room"
      );

      // Notify team members that user is offline
      const offlineStatusPayload = {
        teamId,
        userId: socket.userId,
        status: "offline" as const,
      };
      
      socket.to(`team:${teamId}`).emit("team:member:online", offlineStatusPayload);
      
      logger.info(
        { userId: socket.userId, teamId, userName: socket.user?.fullName, payload: offlineStatusPayload },
        "📢 [SOCKET] Broadcasting offline status to team"
      );
    } catch (error) {
      logger.error({ error, teamId, userId: socket.userId }, "💥 [SOCKET] Error leaving team room");
    }
  });

  /**
   * Send a team message
   */
  socket.on("team:message:send", async ({ teamId, message, attachments }) => {
    try {
      logger.info(
        { 
          userId: socket.userId, 
          teamId, 
          userName: socket.user?.fullName,
          messagePreview: message?.substring(0, 50),
          attachmentsCount: attachments?.length || 0 
        },
        "🔵 [SOCKET] User attempting to send message"
      );

      if (!socket.userId || !socket.user) {
        logger.warn({ teamId, socketId: socket.id }, "❌ [SOCKET] Send message failed: Not authenticated");
        socket.emit("error", { message: "Not authenticated" });
        return;
      }

      // Verify user is a team member
      const isMember = await TeamService.isTeamMember(teamId, socket.userId);
      if (!isMember) {
        logger.warn(
          { userId: socket.userId, teamId, userName: socket.user.fullName },
          "❌ [SOCKET] Send message failed: Not a team member"
        );
        socket.emit("error", { message: "Not a team member" });
        return;
      }

      logger.info(
        { userId: socket.userId, teamId, userName: socket.user.fullName },
        "💾 [SOCKET] Saving message to database"
      );

      // Save message to database
      const chatMessage = await TeamService.sendTeamChatMessage(
        teamId,
        socket.userId,
        {
          message,
          attachments,
        }
      );

      logger.info(
        { userId: socket.userId, teamId, messageId: chatMessage.id, userName: socket.user.fullName },
        "✅ [SOCKET] Message saved to database"
      );

      // Get all sockets in the team room for debugging
      const roomName = `team:${teamId}`;
      const socketsInRoom = await io.in(roomName).fetchSockets();
      const socketIds = socketsInRoom.map(s => s.id);
      const userIds = socketsInRoom.map(s => (s as any).userId);
      
      logger.info(
        { 
          teamId, 
          roomName,
          totalSocketsInRoom: socketsInRoom.length,
          socketIds,
          userIds,
          currentSocketId: socket.id,
          currentUserId: socket.userId
        },
        "🔍 [SOCKET] Room membership before message broadcast"
      );

      // Broadcast message to team room
      const messagePayload = {
        id: chatMessage.id,
        teamId: chatMessage.teamId,
        userId: chatMessage.senderId,
        userName: socket.user.fullName,
        message: chatMessage.message,
        attachments: chatMessage.attachments,
        createdAt: chatMessage.createdAt.toISOString(),
      };

      io.to(roomName).emit("team:message", messagePayload);

      logger.info(
        { 
          userId: socket.userId, 
          teamId, 
          messageId: chatMessage.id, 
          userName: socket.user.fullName,
          payload: messagePayload,
          broadcastToRoom: roomName,
          expectedRecipients: socketsInRoom.length
        },
        "📢 [SOCKET] Message broadcast to all team members (including sender)"
      );
    } catch (error) {
      logger.error({ 
        error, 
        teamId, 
        userId: socket.userId, 
        userName: socket.user?.fullName,
        errorMessage: (error as Error).message 
      }, "💥 [SOCKET] Error sending team message");
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  /**
   * Typing indicator - start
   */
  socket.on("team:typing:start", async ({ teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, userName: socket.user?.fullName },
        "⌨️ [SOCKET] User started typing"
      );

      if (!socket.userId || !socket.user) return;

      // Verify user is a team member
      const isMember = await TeamService.isTeamMember(teamId, socket.userId);
      if (!isMember) return;

      // Broadcast typing indicator to team room (except sender)
      const typingPayload = {
        teamId,
        userId: socket.userId,
        userName: socket.user.fullName,
        isTyping: true,
      };

      socket.to(`team:${teamId}`).emit("team:typing", typingPayload);

      logger.info(
        { userId: socket.userId, teamId, userName: socket.user.fullName },
        "📢 [SOCKET] Broadcasting typing indicator (start) to team"
      );
    } catch (error) {
      logger.error({ error, teamId, userId: socket.userId }, "💥 [SOCKET] Error broadcasting typing indicator");
    }
  });

  /**
   * Typing indicator - stop
   */
  socket.on("team:typing:stop", async ({ teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, userName: socket.user?.fullName },
        "⌨️ [SOCKET] User stopped typing"
      );

      if (!socket.userId || !socket.user) return;

      // Verify user is a team member
      const isMember = await TeamService.isTeamMember(teamId, socket.userId);
      if (!isMember) return;

      // Broadcast typing indicator to team room (except sender)
      const typingPayload = {
        teamId,
        userId: socket.userId,
        userName: socket.user.fullName,
        isTyping: false,
      };

      socket.to(`team:${teamId}`).emit("team:typing", typingPayload);

      logger.info(
        { userId: socket.userId, teamId, userName: socket.user.fullName },
        "📢 [SOCKET] Broadcasting typing indicator (stop) to team"
      );
    } catch (error) {
      logger.error({ error, teamId, userId: socket.userId }, "💥 [SOCKET] Error broadcasting typing indicator");
    }
  });

  /**
   * Message delivered receipt
   */
  socket.on("team:message:delivered", async ({ messageId, teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, messageId, userName: socket.user?.fullName },
        "✉️ [SOCKET] Message delivered receipt"
      );

      if (!socket.userId) return;

      // Broadcast delivery receipt to team room
      const receiptPayload = {
        messageId,
        teamId,
        userId: socket.userId,
        status: "delivered" as const,
      };

      socket.to(`team:${teamId}`).emit("team:message:receipt", receiptPayload);

      logger.info(
        { userId: socket.userId, teamId, messageId },
        "📢 [SOCKET] Broadcasting delivery receipt to team"
      );
    } catch (error) {
      logger.error({ error, messageId, userId: socket.userId }, "💥 [SOCKET] Error sending delivery receipt");
    }
  });

  /**
   * Message read receipt
   */
  socket.on("team:message:read", async ({ messageId, teamId }) => {
    try {
      logger.info(
        { userId: socket.userId, teamId, messageId, userName: socket.user?.fullName },
        "👁️ [SOCKET] Message read receipt"
      );

      if (!socket.userId) return;

      // Broadcast read receipt to team room
      const receiptPayload = {
        messageId,
        teamId,
        userId: socket.userId,
        status: "read" as const,
      };

      socket.to(`team:${teamId}`).emit("team:message:receipt", receiptPayload);

      logger.info(
        { userId: socket.userId, teamId, messageId },
        "📢 [SOCKET] Broadcasting read receipt to team"
      );
    } catch (error) {
      logger.error({ error, messageId, userId: socket.userId }, "💥 [SOCKET] Error sending read receipt");
    }
  });

  /**
   * Handle disconnect
   */
  socket.on("disconnect", async () => {
    try {
      logger.info(
        { userId: socket.userId, socketId: socket.id, userName: socket.user?.fullName },
        "🔴 [SOCKET] User disconnected"
      );

      if (!socket.userId) return;

      // Get all team rooms the user was in
      const rooms = Array.from(socket.rooms).filter((room) =>
        room.startsWith("team:")
      );

      logger.info(
        { userId: socket.userId, userName: socket.user?.fullName, roomsCount: rooms.length, rooms },
        "🔍 [SOCKET] Found team rooms user was in"
      );

      // Notify all team rooms that user is offline
      for (const room of rooms) {
        const teamId = room.replace("team:", "");
        const offlinePayload = {
          teamId,
          userId: socket.userId,
          status: "offline" as const,
        };

        socket.to(room).emit("team:member:online", offlinePayload);

        logger.info(
          { userId: socket.userId, teamId, userName: socket.user?.fullName, room },
          "📢 [SOCKET] Broadcasting offline status to team on disconnect"
        );
      }

      logger.info(
        { userId: socket.userId, socketId: socket.id, userName: socket.user?.fullName },
        "✅ [SOCKET] User disconnect handled successfully"
      );
    } catch (error) {
      logger.error({ error, userId: socket.userId }, "💥 [SOCKET] Error handling disconnect");
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
  const payload = {
    teamId,
    ...data,
  };

  io.to(`team:${teamId}`).emit("team:updated", payload);

  logger.info(
    { teamId, payload },
    "📢 [SOCKET EMIT] Broadcasting team update to all members"
  );
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
  const payload = {
    teamId,
    ...data,
  };

  io.to(`team:${teamId}`).emit("team:member:added", payload);

  logger.info(
    { teamId, userId: data.userId, userName: data.userName, role: data.role, payload },
    "📢 [SOCKET EMIT] Broadcasting member added to all team members"
  );
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
  const payload = {
    teamId,
    ...data,
  };

  io.to(`team:${teamId}`).emit("team:member:removed", payload);

  logger.info(
    { teamId, userId: data.userId, userName: data.userName, payload },
    "📢 [SOCKET EMIT] Broadcasting member removed to all team members"
  );
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
  const payload = {
    teamId,
    ...data,
  };

  io.to(`team:${teamId}`).emit("team:member:role:updated", payload);

  logger.info(
    { teamId, userId: data.userId, userName: data.userName, newRole: data.newRole, payload },
    "📢 [SOCKET EMIT] Broadcasting role update to all team members"
  );
};
