import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { activityService } from "../../shared/services/activity";
import { FeedSocketEmitter } from "./socket";
import type {
  CreatePostInput,
  UpdatePostInput,
  GetPostsInput,
  CreateCommentInput,
  UpdateCommentInput,
  ReportContentInput,
  PinPostInput,
  RecordViewInput,
} from "./types";
import type { FeedCategory, FeedVisibility, UserRole } from "@prisma/client";

export class FeedService {
  /**
   * Get posts with advanced filtering and pagination
   */
  static async getPosts(userId: string, userRole: UserRole, input: GetPostsInput) {
    const {
      category = "all",
      visibility,
      page = 1,
      limit = 20,
      includePinned = true,
      teamId,
      authorId,
      tags,
      search,
    } = input;

    const skip = (page - 1) * limit;

    // Build where clause based on visibility and user role
    const whereClause: any = {
      status: "PUBLISHED",
    };

    // Category filter
    if (category && category !== "all") {
      whereClause.category = category;
    }

    // Role-based visibility
    if (userRole === "STUDENT") {
      whereClause.OR = [
        { visibility: "PUBLIC" },
        { visibility: "STUDENTS_ONLY" },
      ];
    } else if (userRole === "MENTOR") {
      whereClause.OR = [
        { visibility: "PUBLIC" },
        { visibility: "MENTORS_ONLY" },
      ];
    } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      // Admins can see everything
    }

    // Team filter
    if (teamId) {
      whereClause.teamId = teamId;
    }

    // Author filter
    if (authorId) {
      whereClause.authorId = authorId;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      whereClause.tags = { hasSome: tags };
    }

    // Search filter
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    const [posts, total, pinnedPosts] = await Promise.all([
      // Regular posts
      db.feedPost.findMany({
        where: { ...whereClause, isPinned: false },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePhoto: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          attachments: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              views: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Total count
      db.feedPost.count({ where: whereClause }),
      // Pinned posts (if requested)
      includePinned
        ? db.feedPost.findMany({
            where: { ...whereClause, isPinned: true },
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  profilePhoto: true,
                },
              },
              team: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                },
              },
              attachments: true,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                  views: true,
                },
              },
            },
            orderBy: { pinnedAt: "desc" },
          })
        : [],
    ]);

    // Check which posts user has liked
    const postIds = [...posts.map((p) => p.id), ...pinnedPosts.map((p) => p.id)];
    const userLikes = await db.feedLike.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });

    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    // Check which posts user has bookmarked
    const userBookmarks = await db.feedBookmark.findMany({
      where: {
        userId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });

    const bookmarkedPostIds = new Set(userBookmarks.map((b) => b.postId));

    // Format posts
    const formatPost = (post: any) => ({
      ...post,
      author: {
        ...post.author,
        fullName: `${post.author.firstName} ${post.author.lastName}`,
      },
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      viewsCount: post._count.views,
      isLiked: likedPostIds.has(post.id),
      isBookmarked: bookmarkedPostIds.has(post.id),
      _count: undefined,
    });

    return {
      posts: posts.map(formatPost),
      pinnedPosts: pinnedPosts.map(formatPost),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single post by ID
   */
  static async getPostById(userId: string, postId: string) {
    const post = await db.feedPost.findUnique({
      where: { id: postId, status: "PUBLISHED" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePhoto: true,
            bio: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        attachments: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            views: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user liked and bookmarked
    const [liked, bookmarked] = await Promise.all([
      db.feedLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      }),
      db.feedBookmark.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      }),
    ]);

    return {
      ...post,
      author: {
        ...post.author,
        fullName: `${post.author.firstName} ${post.author.lastName}`,
      },
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      viewsCount: post._count.views,
      isLiked: !!liked,
      isBookmarked: !!bookmarked,
      _count: undefined,
    };
  }

  /**
   * Create a new post
   */
  static async createPost(userId: string, userRole: UserRole, input: CreatePostInput) {
    // Validate visibility permissions
    if (input.visibility === "ADMIN_ONLY" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      throw new Error("Only admins can create admin-only posts");
    }

    // Only admins can mark posts as official
    const isOfficial = input.status === "PUBLISHED" && (userRole === "ADMIN" || userRole === "SUPER_ADMIN");

    const postData: any = {
      authorId: userId,
      title: input.title ?? null,
      content: input.content,
      category: input.category,
      tags: input.tags || [],
      imageUrls: input.imageUrls || [],  // Changed to imageUrls array
      videoUrl: input.videoUrl ?? null,
      visibility: input.visibility || "PUBLIC",
      status: input.status || "PUBLISHED",
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      isOfficial,
      teamId: input.teamId ?? null,
    };

    if (input.attachments && input.attachments.length > 0) {
      postData.attachments = {
        create: input.attachments,
      };
    }

    const post = await db.feedPost.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePhoto: true,
          },
        },
        attachments: true,
      },
    });

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "FEED_POST_CREATED",
      metadata: {
        postId: post.id,
        category: post.category,
      },
    });

    logger.info({ userId, postId: post.id }, "Feed post created");

    // Emit socket event
    await FeedSocketEmitter.emitPostCreated(post);

    return post;
  }

  /**
   * Update a post
   */
  static async updatePost(userId: string, userRole: UserRole, postId: string, input: UpdatePostInput) {
    // Get existing post
    const existingPost = await db.feedPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Check permissions
    const isAuthor = existingPost.authorId === userId;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

    if (!isAuthor && !isAdmin) {
      throw new Error("You don't have permission to update this post");
    }

    const post = await db.feedPost.update({
      where: { id: postId },
      data: {
        ...input,
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePhoto: true,
          },
        },
        attachments: true,
      },
    });

    logger.info({ userId, postId }, "Feed post updated");

    return post;
  }

  /**
   * Delete a post
   */
  static async deletePost(userId: string, userRole: UserRole, postId: string) {
    const post = await db.feedPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const isAuthor = post.authorId === userId;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

    if (!isAuthor && !isAdmin) {
      throw new Error("You don't have permission to delete this post");
    }

    await db.feedPost.delete({
      where: { id: postId },
    });

    logger.info({ userId, postId }, "Feed post deleted");

    return { success: true };
  }

  /**
   * Pin or unpin a post (Admin only)
   */
  static async pinPost(userId: string, userRole: UserRole, postId: string, input: PinPostInput) {
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      throw new Error("Only admins can pin posts");
    }

    const post = await db.feedPost.update({
      where: { id: postId },
      data: {
        isPinned: input.isPinned,
        pinnedAt: input.isPinned ? new Date() : null,
        pinnedBy: input.isPinned ? userId : null,
      },
    });

    logger.info({ userId, postId, isPinned: input.isPinned }, "Post pin status updated");

    return post;
  }

  /**
   * Toggle like on a post
   */
  static async togglePostLike(userId: string, postId: string) {
    const existing = await db.feedLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      // Unlike
      await db.feedLike.delete({
        where: { id: existing.id },
      });

      await db.feedPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });

      return { isLiked: false };
    } else {
      // Like
      await db.feedLike.create({
        data: {
          postId,
          userId,
        },
      });

      await db.feedPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });

      return { isLiked: true };
    }
  }

  /**
   * Get users who liked a post
   */
  static async getPostLikes(postId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      db.feedLike.findMany({
        where: { postId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.feedLike.count({ where: { postId } }),
    ]);

    return {
      users: likes.map((like) => ({
        ...like.user,
        fullName: `${like.user.firstName} ${like.user.lastName}`,
        likedAt: like.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get comments for a post
   */
  static async getComments(userId: string, postId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      db.feedComment.findMany({
        where: {
          postId,
          parentId: null, // Top-level comments only
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              profilePhoto: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  profilePhoto: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.feedComment.count({ where: { postId, parentId: null } }),
    ]);

    // Check which comments user has liked
    const commentIds = comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)]);
    const userLikes = await db.feedLike.findMany({
      where: {
        userId,
        commentId: { in: commentIds },
      },
      select: { commentId: true },
    });

    const likedCommentIds = new Set(userLikes.map((l) => l.commentId));

    const formatComment = (comment: any) => ({
      ...comment,
      author: {
        ...comment.author,
        fullName: `${comment.author.firstName} ${comment.author.lastName}`,
      },
      likesCount: comment._count?.likes || 0,
      repliesCount: comment._count?.replies || 0,
      isLiked: likedCommentIds.has(comment.id),
      replies: comment.replies?.map(formatComment) || [],
      _count: undefined,
    });

    return {
      comments: comments.map(formatComment),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a comment
   */
  static async createComment(userId: string, postId: string, input: CreateCommentInput) {
    const comment = await db.feedComment.create({
      data: {
        postId,
        authorId: userId,
        content: input.content,
        parentId: input.parentId ?? null,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Update post comments count
    await db.feedPost.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    // Update parent comment replies count if it's a reply
    if (input.parentId) {
      await db.feedComment.update({
        where: { id: input.parentId },
        data: { repliesCount: { increment: 1 } },
      });
    }

    logger.info({ userId, postId, commentId: comment.id }, "Comment created");

    return comment;
  }

  /**
   * Update a comment
   */
  static async updateComment(userId: string, userRole: UserRole, commentId: string, input: UpdateCommentInput) {
    const existingComment = await db.feedComment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    const isAuthor = existingComment.authorId === userId;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

    if (!isAuthor && !isAdmin) {
      throw new Error("You don't have permission to update this comment");
    }

    const comment = await db.feedComment.update({
      where: { id: commentId },
      data: {
        content: input.content,
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePhoto: true,
          },
        },
      },
    });

    return comment;
  }

  /**
   * Delete a comment
   */
  static async deleteComment(userId: string, userRole: UserRole, commentId: string) {
    const comment = await db.feedComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    const isAuthor = comment.authorId === userId;
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

    if (!isAuthor && !isAdmin) {
      throw new Error("You don't have permission to delete this comment");
    }

    // Update post comments count
    await db.feedPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    });

    // Update parent comment replies count if it's a reply
    if (comment.parentId) {
      await db.feedComment.update({
        where: { id: comment.parentId },
        data: { repliesCount: { decrement: 1 } },
      });
    }

    await db.feedComment.delete({
      where: { id: commentId },
    });

    logger.info({ userId, commentId }, "Comment deleted");

    return { success: true };
  }

  /**
   * Toggle like on a comment
   */
  static async toggleCommentLike(userId: string, commentId: string) {
    const existing = await db.feedLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existing) {
      // Unlike
      await db.feedLike.delete({
        where: { id: existing.id },
      });

      await db.feedComment.update({
        where: { id: commentId },
        data: { likesCount: { decrement: 1 } },
      });

      return { isLiked: false };
    } else {
      // Like
      await db.feedLike.create({
        data: {
          commentId,
          userId,
        },
      });

      await db.feedComment.update({
        where: { id: commentId },
        data: { likesCount: { increment: 1 } },
      });

      return { isLiked: true };
    }
  }

  /**
   * Record a view (idempotent)
   */
  static async recordView(userId: string, input: RecordViewInput) {
    const existing = await db.feedView.findUnique({
      where: {
        postId_userId: {
          postId: input.postId,
          userId,
        },
      },
    });

    if (!existing) {
      await db.feedView.create({
        data: {
          postId: input.postId,
          userId,
          duration: input.duration ?? null,
        },
      });

      await db.feedPost.update({
        where: { id: input.postId },
        data: { viewsCount: { increment: 1 } },
      });
    }

    const post = await db.feedPost.findUnique({
      where: { id: input.postId },
      select: { viewsCount: true },
    });

    return { viewsCount: post?.viewsCount || 0 };
  }

  /**
   * Toggle bookmark
   */
  static async toggleBookmark(userId: string, postId: string) {
    const existing = await db.feedBookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      await db.feedBookmark.delete({
        where: { id: existing.id },
      });

      return { isBookmarked: false };
    } else {
      await db.feedBookmark.create({
        data: {
          postId,
          userId,
        },
      });

      return { isBookmarked: true };
    }
  }

  /**
   * Get user's bookmarked posts
   */
  static async getBookmarks(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      db.feedBookmark.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                  profilePhoto: true,
                },
              },
              attachments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.feedBookmark.count({ where: { userId } }),
    ]);

    return {
      posts: bookmarks.map((b) => b.post),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Report content
   */
  static async reportContent(userId: string, input: ReportContentInput) {
    const report = await db.feedReport.create({
      data: {
        reporterId: userId,
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
        reason: input.reason,
        description: input.description ?? null,
      },
    });

    logger.info({ userId, reportId: report.id }, "Content reported");

    return report;
  }

  /**
   * Get trending tags
   */
  static async getTrendingTags(limit: number = 10) {
    const posts = await db.feedPost.findMany({
      where: {
        status: "PUBLISHED",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));

    return sortedTags;
  }
}
