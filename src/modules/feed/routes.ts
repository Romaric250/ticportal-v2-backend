import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { FeedController } from "./controller";

const router = Router();

// ==================== PUBLIC/STUDENT ROUTES ====================

// Posts
router.get("/feed/posts", authenticate, FeedController.getPosts);
router.get("/feed/posts/:postId", authenticate, FeedController.getPostById);
router.post("/feed/posts", authenticate, FeedController.createPost);
router.put("/feed/posts/:postId", authenticate, FeedController.updatePost);
router.delete("/feed/posts/:postId", authenticate, FeedController.deletePost);

// Post interactions
router.post("/feed/posts/:postId/like", authenticate, FeedController.togglePostLike);
router.get("/feed/posts/:postId/likes", authenticate, FeedController.getPostLikes);
router.post("/feed/posts/:postId/view", authenticate, FeedController.recordView);
router.post("/feed/posts/:postId/bookmark", authenticate, FeedController.toggleBookmark);

// Comments
router.get("/feed/posts/:postId/comments", authenticate, FeedController.getComments);
router.post("/feed/posts/:postId/comments", authenticate, FeedController.createComment);
router.put("/feed/comments/:commentId", authenticate, FeedController.updateComment);
router.delete("/feed/comments/:commentId", authenticate, FeedController.deleteComment);
router.post("/feed/comments/:commentId/like", authenticate, FeedController.toggleCommentLike);

// Bookmarks
router.get("/feed/bookmarks", authenticate, FeedController.getBookmarks);

// Reports
router.post("/feed/report", authenticate, FeedController.reportContent);

// Trending
router.get("/feed/trending-tags", authenticate, FeedController.getTrendingTags);

// ==================== ADMIN ROUTES ====================

// Pin/Unpin posts (Admin only)
router.post("/feed/posts/:postId/pin", authenticate, FeedController.pinPost);

export default router;
