import type { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../../shared/utils/jwt";
import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import type { FeedCategory } from "@prisma/client";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

interface FeedJoinPayload {
  category?: FeedCategory | "all";
}

interface FeedTypingPayload {
  postId: string;
  isTyping: boolean;
}

interface FeedViewPayload {
  postId: string;
}

/**
 * Setup feed WebSocket handlers
 */
export function setupFeedSocket(io: Server) {
  const feedNamespace = io.of("/feed");

  // Authentication middleware
  feedNamespace.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;

      logger.info({ userId: socket.userId }, "User connected to feed socket");
      next();
    } catch (error) {
      logger.error({ error }, "Feed socket authentication failed");
      next(new Error("Invalid authentication token"));
    }
  });

  feedNamespace.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const userRole = socket.userRole!;

    logger.info({ userId, socketId: socket.id }, "User connected to feed");

    /**
     * Join feed room based on category
     */
    socket.on("feed:join", async (payload: FeedJoinPayload) => {
      try {
        const category = payload.category || "all";
        const roomName = `feed:${category}`;

        // Leave all previous feed rooms
        const rooms = Array.from(socket.rooms).filter((room) => room.startsWith("feed:"));
        rooms.forEach((room) => socket.leave(room));

        // Join new room
        socket.join(roomName);
        socket.emit("feed:joined", { category, room: roomName });

        logger.info({ userId, room: roomName }, "User joined feed room");
      } catch (error) {
        logger.error({ error, userId }, "Failed to join feed room");
        socket.emit("feed:error", { message: "Failed to join feed room" });
      }
    });

    /**
     * Leave feed room
     */
    socket.on("feed:leave", () => {
      const rooms = Array.from(socket.rooms).filter((room) => room.startsWith("feed:"));
      rooms.forEach((room) => {
        socket.leave(room);
        logger.info({ userId, room }, "User left feed room");
      });
    });

    /**
     * Typing indicator for comments
     */
    socket.on("feed:typing:comment", async (payload: FeedTypingPayload) => {
      try {
        const { postId, isTyping } = payload;

        // Get user info
        const user = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });

        if (!user) return;

        // Broadcast to all users viewing this post
        socket.broadcast.emit("feed:typing:comment", {
          postId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          isTyping,
        });

        // Update presence
        if (isTyping) {
          await db.feedPresence.upsert({
            where: {
              userId_postId: {
                userId,
                postId: postId ?? "",
              },
            },
            create: {
              userId,
              postId: postId ?? "",
              status: "typing_comment",
              lastActive: new Date(),
            },
            update: {
              status: "typing_comment",
              lastActive: new Date(),
            },
          });
        }
      } catch (error) {
        logger.error({ error, userId }, "Failed to handle typing indicator");
      }
    });

    /**
     * Record post view (real-time)
     */
    socket.on("feed:post:view", async (payload: FeedViewPayload) => {
      try {
        const { postId } = payload;

        // Update presence
        await db.feedPresence.upsert({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
          create: {
            userId,
            postId,
            status: "viewing",
            lastActive: new Date(),
          },
          update: {
            status: "viewing",
            lastActive: new Date(),
          },
        });

        logger.info({ userId, postId }, "User viewing post");
      } catch (error) {
        logger.error({ error, userId }, "Failed to record post view");
      }
    });

    /**
     * Disconnect handler
     */
    socket.on("disconnect", async () => {
      try {
        // Clean up presence
        await db.feedPresence.deleteMany({
          where: { userId },
        });

        logger.info({ userId, socketId: socket.id }, "User disconnected from feed");
      } catch (error) {
        logger.error({ error, userId }, "Failed to cleanup on disconnect");
      }
    });
  });

  return feedNamespace;
}

/**
 * Emit feed events (called from service layer)
 */
export class FeedSocketEmitter {
  private static io: Server;

  static initialize(io: Server) {
    this.io = io;
  }

  /**
   * Broadcast new post created
   */
  static async emitPostCreated(post: any) {
    try {
      const feedNamespace = this.io.of("/feed");
      const room = `feed:${post.category}`;
      const allRoom = "feed:all";

      // Emit to category room and "all" room
      feedNamespace.to(room).to(allRoom).emit("feed:post:created", { post });

      logger.info({ postId: post.id, category: post.category }, "Post created event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit post created event");
    }
  }

  /**
   * Broadcast post updated
   */
  static async emitPostUpdated(postId: string, updates: any, category: FeedCategory) {
    try {
      const feedNamespace = this.io.of("/feed");
      const room = `feed:${category}`;
      const allRoom = "feed:all";

      feedNamespace.to(room).to(allRoom).emit("feed:post:updated", {
        postId,
        updates,
      });

      logger.info({ postId }, "Post updated event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit post updated event");
    }
  }

  /**
   * Broadcast post deleted
   */
  static async emitPostDeleted(postId: string, category: FeedCategory) {
    try {
      const feedNamespace = this.io.of("/feed");
      const room = `feed:${category}`;
      const allRoom = "feed:all";

      feedNamespace.to(room).to(allRoom).emit("feed:post:deleted", { postId });

      logger.info({ postId }, "Post deleted event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit post deleted event");
    }
  }

  /**
   * Broadcast post pinned/unpinned
   */
  static async emitPostPinned(postId: string, isPinned: boolean, category: FeedCategory) {
    try {
      const feedNamespace = this.io.of("/feed");
      const room = `feed:${category}`;
      const allRoom = "feed:all";

      feedNamespace.to(room).to(allRoom).emit("feed:post:pinned", {
        postId,
        isPinned,
      });

      logger.info({ postId, isPinned }, "Post pin status event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit post pin event");
    }
  }

  /**
   * Broadcast post liked
   */
  static async emitPostLiked(postId: string, userId: string, userName: string, isLiked: boolean, likesCount: number) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:post:liked", {
        postId,
        userId,
        userName,
        isLiked,
        likesCount,
      });

      logger.info({ postId, isLiked }, "Post like event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit post like event");
    }
  }

  /**
   * Broadcast comment created
   */
  static async emitCommentCreated(postId: string, comment: any, commentsCount: number) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:comment:created", {
        postId,
        comment,
        commentsCount,
      });

      logger.info({ postId, commentId: comment.id }, "Comment created event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit comment created event");
    }
  }

  /**
   * Broadcast comment updated
   */
  static async emitCommentUpdated(postId: string, commentId: string, content: string, updatedAt: Date) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:comment:updated", {
        postId,
        commentId,
        content,
        updatedAt,
      });

      logger.info({ commentId }, "Comment updated event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit comment updated event");
    }
  }

  /**
   * Broadcast comment deleted
   */
  static async emitCommentDeleted(postId: string, commentId: string, commentsCount: number) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:comment:deleted", {
        postId,
        commentId,
        commentsCount,
      });

      logger.info({ commentId }, "Comment deleted event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit comment deleted event");
    }
  }

  /**
   * Broadcast comment liked
   */
  static async emitCommentLiked(postId: string, commentId: string, userId: string, isLiked: boolean, likesCount: number) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:comment:liked", {
        postId,
        commentId,
        userId,
        isLiked,
        likesCount,
      });

      logger.info({ commentId, isLiked }, "Comment like event emitted");
    } catch (error) {
      logger.error({ error }, "Failed to emit comment like event");
    }
  }

  /**
   * Broadcast view count updated
   */
  static async emitViewIncremented(postId: string, viewsCount: number) {
    try {
      const feedNamespace = this.io.of("/feed");

      feedNamespace.emit("feed:view:incremented", {
        postId,
        viewsCount,
      });
    } catch (error) {
      logger.error({ error }, "Failed to emit view increment event");
    }
  }
}
