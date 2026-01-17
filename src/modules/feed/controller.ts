import type { Request, Response } from "express";
import { FeedService } from "./service";
import { FeedPointsService } from "./points.service";
import { logger } from "../../shared/utils/logger";
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

export class FeedController {
  /**
   * GET /api/feed/posts
   * Get posts with smart algorithm (no duplicates)
   */
  static async getPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const input: GetPostsInput = {
        category: req.query.category as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        includePinned: req.query.includePinned !== "false",
        ...(req.query.teamId && { teamId: req.query.teamId as string }),
        ...(req.query.authorId && { authorId: req.query.authorId as string }),
        ...(req.query.tags && { tags: (req.query.tags as string).split(",") }),
        ...(req.query.search && { search: req.query.search as string }),
        ...(req.query.excludePostIds && { 
          excludePostIds: (req.query.excludePostIds as string).split(",") 
        }),
      };

      const result = await FeedService.getPosts(userId, userRole, input);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get posts");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get posts",
      });
    }
  }

  /**
   * GET /api/feed/posts/:postId
   * Get single post
   */
  static async getPostById(req: Request, res: Response) {
    try {
      const { postId } = req.params
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const post = await FeedService.getPostById(userId, postId);

      res.json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      const statusCode = error.message === "Post not found" ? 404 : 500;
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to get post");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get post",
      });
    }
  }

  /**
   * POST /api/feed/posts
   * Create a new post
   */
  static async createPost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const input: CreatePostInput = req.body;

      const post = await FeedService.createPost(userId, userRole, input);

      res.status(201).json({
        success: true,
        data: post,
        message: "Post created successfully",
      });
    } catch (error: any) {
      logger.error({ error: error.message, userId: (req as any).user?.userId }, "Failed to create post");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create post",
      });
    }
  }

  /**
   * PUT /api/feed/posts/:postId
   * Update a post
   */
  static async updatePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const input: UpdatePostInput = req.body;

      const post = await FeedService.updatePost(userId, userRole, postId, input);

      res.json({
        success: true,
        data: post,
        message: "Post updated successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Post not found" ? 404 : 
                         error.message.includes("permission") ? 403 : 500;
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to update post");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to update post",
      });
    }
  }

  /**
   * DELETE /api/feed/posts/:postId
   * Delete a post
   */
  static async deletePost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      await FeedService.deletePost(userId, userRole, postId);

      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Post not found" ? 404 : 
                         error.message.includes("permission") ? 403 : 500;
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to delete post");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete post",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/pin
   * Pin or unpin a post (Admin only)
   */
  static async pinPost(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const input: PinPostInput = req.body;

      const post = await FeedService.pinPost(userId, userRole, postId, input);

      res.json({
        success: true,
        data: post,
        message: `Post ${input.isPinned ? "pinned" : "unpinned"} successfully`,
      });
    } catch (error: any) {
      const statusCode = error.message.includes("admin") ? 403 : 500;
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to pin post");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to pin post",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/like
   * Toggle like on a post
   */
  static async togglePostLike(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const result = await FeedService.togglePostLike(userId, postId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to toggle like");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to toggle like",
      });
    }
  }

  /**
   * GET /api/feed/posts/:postId/likes
   * Get users who liked a post
   */
  static async getPostLikes(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const result = await FeedService.getPostLikes(postId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to get likes");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get likes",
      });
    }
  }

  /**
   * GET /api/feed/posts/:postId/comments
   * Get comments for a post
   */
  static async getComments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const result = await FeedService.getComments(userId, postId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to get comments");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get comments",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/comments
   * Create a comment
   */
  static async createComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const input: CreateCommentInput = req.body;

      const comment = await FeedService.createComment(userId, postId, input);

      res.status(201).json({
        success: true,
        data: comment,
        message: "Comment created successfully",
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to create comment");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create comment",
      });
    }
  }

  /**
   * PUT /api/feed/comments/:commentId
   * Update a comment
   */
  static async updateComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
      }

      const input: UpdateCommentInput = req.body;

      const comment = await FeedService.updateComment(userId, userRole, commentId, input);

      res.json({
        success: true,
        data: comment,
        message: "Comment updated successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Comment not found" ? 404 : 
                         error.message.includes("permission") ? 403 : 500;
      logger.error({ error: error.message, commentId: req.params.commentId }, "Failed to update comment");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to update comment",
      });
    }
  }

  /**
   * DELETE /api/feed/comments/:commentId
   * Delete a comment
   */
  static async deleteComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
      }

      await FeedService.deleteComment(userId, userRole, commentId);

      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Comment not found" ? 404 : 
                         error.message.includes("permission") ? 403 : 500;
      logger.error({ error: error.message, commentId: req.params.commentId }, "Failed to delete comment");
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete comment",
      });
    }
  }

  /**
   * POST /api/feed/comments/:commentId/like
   * Toggle like on a comment
   */
  static async toggleCommentLike(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required",
        });
      }

      const result = await FeedService.toggleCommentLike(userId, commentId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, commentId: req.params.commentId }, "Failed to toggle comment like");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to toggle like",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/view
   * Record a view
   */
  static async recordView(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const input: RecordViewInput = {
        postId,
        duration: req.body.duration,
      };

      const result = await FeedService.recordView(userId, input);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to record view");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to record view",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/bookmark
   * Toggle bookmark
   */
  static async toggleBookmark(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const result = await FeedService.toggleBookmark(userId, postId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to toggle bookmark");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to toggle bookmark",
      });
    }
  }

  /**
   * GET /api/feed/bookmarks
   * Get user's bookmarked posts
   */
  static async getBookmarks(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await FeedService.getBookmarks(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get bookmarks");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get bookmarks",
      });
    }
  }

  /**
   * POST /api/feed/report
   * Report content
   */
  static async reportContent(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const input: ReportContentInput = req.body;

      const report = await FeedService.reportContent(userId, input);

      res.status(201).json({
        success: true,
        data: report,
        message: "Content reported successfully",
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to report content");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to report content",
      });
    }
  }

  /**
   * GET /api/feed/trending-tags
   * Get trending tags
   */
  static async getTrendingTags(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const tags = await FeedService.getTrendingTags(limit);

      res.json({
        success: true,
        data: tags,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get trending tags");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get trending tags",
      });
    }
  }

  /**
   * GET /api/feed/trending
   * Get trending posts (last 7 days, high engagement)
   */
  static async getTrendingPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const posts = await FeedService.getTrendingPosts(userId, userRole, limit);

      res.json({
        success: true,
        data: posts,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get trending posts");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get trending posts",
      });
    }
  }

  /**
   * GET /api/feed/latest
   * Get latest posts
   */
  static async getLatestPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const posts = await FeedService.getLatestPosts(userId, userRole, limit);

      res.json({
        success: true,
        data: posts,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get latest posts");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get latest posts",
      });
    }
  }

  /**
   * GET /api/feed/search
   * Search posts
   */
  static async searchPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;
      const query = req.query.q as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await FeedService.searchPosts(userId, userRole, query, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to search posts");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search posts",
      });
    }
  }

  /**
   * POST /api/feed/posts/:postId/record-view
   * Record view when user scrolls to post (frontend triggered)
   */
  static async recordPostView(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { postId } = req.params;
      const { duration } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post ID is required",
        });
      }

      const result = await FeedService.recordPostView(userId, postId, duration);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error({ error: error.message, postId: req.params.postId }, "Failed to record view");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to record view",
      });
    }
  }

  /**
   * GET /api/feed/points/summary
   * Get user's feed points summary
   */
  static async getFeedPointsSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const summary = await FeedPointsService.getUserFeedPointsSummary(userId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get feed points summary");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get feed points summary",
      });
    }
  }
}
