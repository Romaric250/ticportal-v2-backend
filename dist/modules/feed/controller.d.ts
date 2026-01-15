import type { Request, Response } from "express";
export declare class FeedController {
    /**
     * GET /api/feed/posts
     * Get paginated feed posts with filters
     */
    static getPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/feed/posts/:postId
     * Get single post
     */
    static getPostById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts
     * Create a new post
     */
    static createPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/feed/posts/:postId
     * Update a post
     */
    static updatePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/feed/posts/:postId
     * Delete a post
     */
    static deletePost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts/:postId/pin
     * Pin or unpin a post (Admin only)
     */
    static pinPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts/:postId/like
     * Toggle like on a post
     */
    static togglePostLike(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/feed/posts/:postId/likes
     * Get users who liked a post
     */
    static getPostLikes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/feed/posts/:postId/comments
     * Get comments for a post
     */
    static getComments(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts/:postId/comments
     * Create a comment
     */
    static createComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/feed/comments/:commentId
     * Update a comment
     */
    static updateComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/feed/comments/:commentId
     * Delete a comment
     */
    static deleteComment(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/comments/:commentId/like
     * Toggle like on a comment
     */
    static toggleCommentLike(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts/:postId/view
     * Record a view
     */
    static recordView(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/posts/:postId/bookmark
     * Toggle bookmark
     */
    static toggleBookmark(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/feed/bookmarks
     * Get user's bookmarked posts
     */
    static getBookmarks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/feed/report
     * Report content
     */
    static reportContent(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/feed/trending-tags
     * Get trending tags
     */
    static getTrendingTags(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/feed/points/summary
     * Get user's feed points summary
     */
    static getFeedPointsSummary(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map