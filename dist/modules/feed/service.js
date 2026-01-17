import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
import { activityService } from "../../shared/services/activity.js";
import { FeedSocketEmitter } from "./socket.js";
import { FeedPointsService } from "./points.service.js";
import { BadgeService } from "../badges/service.js";
export class FeedService {
    /**
     * Get posts with advanced filtering and pagination + SMART ALGORITHM
     */
    static async getPosts(userId, userRole, input) {
        const { category = "all", visibility, page = 1, limit = 10, includePinned = true, teamId, authorId, tags, search, excludePostIds = [], // NEW: Posts to exclude (already seen)
         } = input;
        const skip = (page - 1) * limit;
        // Build where clause based on visibility and user role
        const whereClause = {
            status: "PUBLISHED",
        };
        // Exclude already seen posts to prevent duplicates
        if (excludePostIds.length > 0) {
            whereClause.id = { notIn: excludePostIds };
        }
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
        }
        else if (userRole === "MENTOR") {
            whereClause.OR = [
                { visibility: "PUBLIC" },
                { visibility: "MENTORS_ONLY" },
            ];
        }
        else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
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
        // Get more posts than needed for smart ranking
        const fetchLimit = limit * 3; // Fetch 3x to allow ranking algorithm
        const [allPosts, total, pinnedPosts] = await Promise.all([
            // Regular posts (fetch more for ranking)
            db.feedPost.findMany({
                where: { ...whereClause, isPinned: false },
                skip: 0, // Always start from 0, we filter via excludePostIds
                take: fetchLimit,
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
                },
                orderBy: { createdAt: "desc" }, // Start with recent posts
            }),
            // Total count (excluding already seen posts)
            db.feedPost.count({ where: whereClause }),
            // Pinned posts (if requested and first page)
            includePinned && page === 1
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
                    },
                    orderBy: { pinnedAt: "desc" },
                })
                : [],
        ]);
        // 🔥 SMART RANKING ALGORITHM
        const rankedPosts = this.rankPosts(allPosts, userId);
        // Take only the requested limit after ranking
        const posts = rankedPosts.slice(0, limit);
        // Return post IDs for client to track
        const returnedPostIds = [...pinnedPosts.map(p => p.id), ...posts.map(p => p.id)];
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
        const formatPost = (post) => ({
            ...post,
            author: {
                ...post.author,
                fullName: `${post.author.firstName} ${post.author.lastName}`,
            },
            likesCount: post.likesCount || 0,
            commentsCount: post.commentsCount || 0,
            viewsCount: post.viewsCount || 0,
            isLiked: likedPostIds.has(post.id),
            isBookmarked: bookmarkedPostIds.has(post.id),
            _count: undefined,
            score: undefined, // Remove internal score from response
        });
        return {
            posts: posts.map(formatPost),
            pinnedPosts: pinnedPosts.map(formatPost),
            returnedPostIds, // NEW: Return IDs for client to track
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: posts.length === limit, // NEW: Indicate if more posts available
            },
        };
    }
    /**
     * 🔥 SMART RANKING ALGORITHM
     * Balances recency, engagement, and diversity
     */
    static rankPosts(posts, userId) {
        const now = Date.now();
        // Calculate score for each post
        const postsWithScore = posts.map((post) => {
            // 1. RECENCY SCORE (0-1, decays exponentially)
            const ageInHours = (now - post.createdAt.getTime()) / (1000 * 60 * 60);
            const recencyScore = Math.exp(-ageInHours / 24); // Half-life of 24 hours
            // 2. ENGAGEMENT SCORE (normalized)
            const engagementScore = post.likesCount * 1 +
                post.commentsCount * 3 + // Comments worth 3x likes
                post.viewsCount * 0.05 +
                (post.bookmarksCount || 0) * 2;
            // Normalize engagement (log scale to prevent viral posts from dominating)
            const normalizedEngagement = Math.log10(engagementScore + 1) / 3;
            // 3. DIVERSITY SCORE (reduce author repetition)
            // This will be adjusted after initial sort
            // 4. FINAL SCORE (weighted combination)
            const finalScore = recencyScore * 0.4 + // 40% recency
                normalizedEngagement * 0.35 + // 35% engagement
                Math.random() * 0.25; // 25% randomness for diversity
            return {
                ...post,
                score: finalScore,
                recencyScore,
                engagementScore: normalizedEngagement,
            };
        });
        // Sort by score
        let sorted = postsWithScore.sort((a, b) => b.score - a.score);
        // Apply diversity filter (prevent same author appearing consecutively)
        sorted = this.applyDiversityFilter(sorted);
        return sorted;
    }
    /**
     * Apply diversity filter to prevent author repetition
     */
    static applyDiversityFilter(posts) {
        const result = [];
        const recentAuthors = [];
        const maxConsecutive = 2;
        const remaining = [...posts];
        while (remaining.length > 0 && result.length < posts.length) {
            let foundDiverse = false;
            // Try to find a post from a different author
            for (let i = 0; i < remaining.length; i++) {
                const post = remaining[i];
                const recentAuthorCount = recentAuthors.filter((id) => id === post.authorId).length;
                if (recentAuthorCount < maxConsecutive) {
                    result.push(post);
                    recentAuthors.push(post.authorId);
                    if (recentAuthors.length > maxConsecutive * 2) {
                        recentAuthors.shift(); // Keep sliding window
                    }
                    remaining.splice(i, 1);
                    foundDiverse = true;
                    break;
                }
            }
            // If can't find diverse, just take the next best
            if (!foundDiverse && remaining.length > 0) {
                const post = remaining.shift();
                result.push(post);
                recentAuthors.push(post.authorId);
                if (recentAuthors.length > maxConsecutive * 2) {
                    recentAuthors.shift();
                }
            }
        }
        return result;
    }
    /**
     * Get single post by ID
     */
    static async getPostById(userId, postId) {
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
    static async createPost(userId, userRole, input) {
        // Validate visibility permissions
        if (input.visibility === "ADMIN_ONLY" && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
            throw new Error("Only admins can create admin-only posts");
        }
        // Only admins can mark posts as official
        const isOfficial = input.status === "PUBLISHED" && (userRole === "ADMIN" || userRole === "SUPER_ADMIN");
        const postData = {
            authorId: userId,
            title: input.title ?? null,
            content: input.content,
            category: input.category,
            tags: input.tags || [],
            imageUrls: input.imageUrls || [], // Changed to imageUrls array
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
        // Award points for creating the post
        await FeedPointsService.awardPostCreationPoints(userId, post.id, (input.imageUrls && input.imageUrls.length > 0) || false, !!input.videoUrl);
        // Check and award badges
        await BadgeService.checkAndAwardBadges(userId);
        // Emit socket event
        await FeedSocketEmitter.emitPostCreated(post);
        return post;
    }
    /**
     * Update a post
     */
    static async updatePost(userId, userRole, postId, input) {
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
    static async deletePost(userId, userRole, postId) {
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
    static async pinPost(userId, userRole, postId, input) {
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
    static async togglePostLike(userId, postId) {
        // Get post info for points
        const post = await db.feedPost.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (!post) {
            throw new Error("Post not found");
        }
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
        }
        else {
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
            // Award points to the liker
            await FeedPointsService.awardLikeGivenPoints(userId, postId);
            // Award points to the post author
            await FeedPointsService.awardLikeReceivedPoints(post.authorId, postId, userId);
            // Emit socket events for points
            await FeedSocketEmitter.emitPointsEarned(userId, 2, "Liked a post", { postId });
            await FeedSocketEmitter.emitPointsEarned(post.authorId, 5, "Post liked", { postId, likerId: userId });
            // Check and award badges
            await BadgeService.checkAndAwardBadges(userId);
            return { isLiked: true };
        }
    }
    /**
     * Get users who liked a post
     */
    static async getPostLikes(postId, page = 1, limit = 50) {
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
    static async getComments(userId, postId, page = 1, limit = 50) {
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
        const formatComment = (comment) => ({
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
    static async createComment(userId, postId, input) {
        // Get post to award points to author
        const post = await db.feedPost.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (!post) {
            throw new Error("Post not found");
        }
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
        // Award points to the commenter
        await FeedPointsService.awardCommentGivenPoints(userId, postId, comment.id);
        // Award points to the post author
        await FeedPointsService.awardCommentReceivedPoints(post.authorId, postId, userId);
        // Check and award badges
        await BadgeService.checkAndAwardBadges(userId);
        // Emit socket events for points
        await FeedSocketEmitter.emitPointsEarned(userId, 15, "Commented on post", { postId, commentId: comment.id });
        await FeedSocketEmitter.emitPointsEarned(post.authorId, 10, "Post received comment", { postId, commentId: comment.id });
        return comment;
    }
    /**
     * Update a comment
     */
    static async updateComment(userId, userRole, commentId, input) {
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
    static async deleteComment(userId, userRole, commentId) {
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
    static async toggleCommentLike(userId, commentId) {
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
        }
        else {
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
    static async recordView(userId, input) {
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
            // Track view activity (no points, just analytics)
            await FeedPointsService.trackPostView(userId, input.postId, input.duration);
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
    static async toggleBookmark(userId, postId) {
        // Get post info for points
        const post = await db.feedPost.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (!post) {
            throw new Error("Post not found");
        }
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
        }
        else {
            await db.feedBookmark.create({
                data: {
                    postId,
                    userId,
                },
            });
            // Award points to the post author
            await FeedPointsService.awardBookmarkReceivedPoints(post.authorId, postId, userId);
            // Emit socket event for points
            await FeedSocketEmitter.emitPointsEarned(post.authorId, 3, "Post bookmarked", { postId, bookmarkerId: userId });
            return { isBookmarked: true };
        }
    }
    /**
     * Get user's bookmarked posts
     */
    static async getBookmarks(userId, page = 1, limit = 20) {
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
    static async reportContent(userId, input) {
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
    static async getTrendingTags(limit = 10) {
        const posts = await db.feedPost.findMany({
            where: {
                status: "PUBLISHED",
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
            },
            select: { tags: true },
        });
        const tagCounts = {};
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
    /**
     * Get trending posts (based on engagement in last 7 days)
     */
    static async getTrendingPosts(userId, userRole, limit = 3) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        // Build where clause based on visibility and user role
        const whereClause = {
            status: "PUBLISHED",
            createdAt: {
                gte: sevenDaysAgo,
            },
        };
        // Role-based visibility
        if (userRole === "STUDENT") {
            whereClause.OR = [
                { visibility: "PUBLIC" },
                { visibility: "STUDENTS_ONLY" },
            ];
        }
        else if (userRole === "MENTOR") {
            whereClause.OR = [
                { visibility: "PUBLIC" },
                { visibility: "MENTORS_ONLY" },
            ];
        }
        const posts = await db.feedPost.findMany({
            where: whereClause,
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
            },
            orderBy: [
                { likesCount: "desc" },
                { commentsCount: "desc" },
                { viewsCount: "desc" },
            ],
            take: limit * 3, // Get more to calculate score
        });
        // Calculate trending score for each post
        const postsWithScore = posts.map((post) => {
            const ageInHours = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60);
            const timeDecay = Math.max(0, 1 - ageInHours / 168); // 7 days decay
            const engagementScore = post.likesCount * 3 +
                post.commentsCount * 5 +
                post.viewsCount * 0.1 +
                (post.isPinned ? 100 : 0);
            const trendingScore = engagementScore * timeDecay;
            return {
                ...post,
                trendingScore,
            };
        });
        // Sort by trending score and take top N
        const trendingPosts = postsWithScore
            .sort((a, b) => b.trendingScore - a.trendingScore)
            .slice(0, limit);
        // Check user interactions
        const postIds = trendingPosts.map((p) => p.id);
        const [userLikes, userBookmarks] = await Promise.all([
            db.feedLike.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
            db.feedBookmark.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
        ]);
        const likedPostIds = new Set(userLikes.map((l) => l.postId));
        const bookmarkedPostIds = new Set(userBookmarks.map((b) => b.postId));
        return trendingPosts.map((post) => ({
            ...post,
            author: {
                ...post.author,
                fullName: `${post.author.firstName} ${post.author.lastName}`,
            },
            isLiked: likedPostIds.has(post.id),
            isBookmarked: bookmarkedPostIds.has(post.id),
            trendingScore: undefined, // Remove score from response
        }));
    }
    /**
     * Get latest posts
     */
    static async getLatestPosts(userId, userRole, limit = 3) {
        const whereClause = {
            status: "PUBLISHED",
        };
        // Role-based visibility
        if (userRole === "STUDENT") {
            whereClause.OR = [
                { visibility: "PUBLIC" },
                { visibility: "STUDENTS_ONLY" },
            ];
        }
        else if (userRole === "MENTOR") {
            whereClause.OR = [
                { visibility: "PUBLIC" },
                { visibility: "MENTORS_ONLY" },
            ];
        }
        const posts = await db.feedPost.findMany({
            where: whereClause,
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
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
        // Check user interactions
        const postIds = posts.map((p) => p.id);
        const [userLikes, userBookmarks] = await Promise.all([
            db.feedLike.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
            db.feedBookmark.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
        ]);
        const likedPostIds = new Set(userLikes.map((l) => l.postId));
        const bookmarkedPostIds = new Set(userBookmarks.map((b) => b.postId));
        return posts.map((post) => ({
            ...post,
            author: {
                ...post.author,
                fullName: `${post.author.firstName} ${post.author.lastName}`,
            },
            isLiked: likedPostIds.has(post.id),
            isBookmarked: bookmarkedPostIds.has(post.id),
        }));
    }
    /**
     * Search posts
     */
    static async searchPosts(userId, userRole, query, page = 1, limit = 20) {
        if (query.length < 2) {
            throw new Error("Search query must be at least 2 characters");
        }
        const skip = (page - 1) * limit;
        const whereClause = {
            status: "PUBLISHED",
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
                { tags: { hasSome: [query.toLowerCase()] } },
            ],
        };
        // Role-based visibility
        const visibilityOR = [];
        if (userRole === "STUDENT") {
            visibilityOR.push({ visibility: "PUBLIC" }, { visibility: "STUDENTS_ONLY" });
        }
        else if (userRole === "MENTOR") {
            visibilityOR.push({ visibility: "PUBLIC" }, { visibility: "MENTORS_ONLY" });
        }
        else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
            // Admins can see everything
        }
        else {
            visibilityOR.push({ visibility: "PUBLIC" });
        }
        if (visibilityOR.length > 0) {
            whereClause.AND = [{ OR: visibilityOR }];
        }
        const [posts, total] = await Promise.all([
            db.feedPost.findMany({
                where: whereClause,
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
                },
                orderBy: [
                    { likesCount: "desc" }, // Most liked first
                    { createdAt: "desc" }, // Then newest
                ],
            }),
            db.feedPost.count({ where: whereClause }),
        ]);
        // Check user interactions
        const postIds = posts.map((p) => p.id);
        const [userLikes, userBookmarks] = await Promise.all([
            db.feedLike.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
            db.feedBookmark.findMany({
                where: { userId, postId: { in: postIds } },
                select: { postId: true },
            }),
        ]);
        const likedPostIds = new Set(userLikes.map((l) => l.postId));
        const bookmarkedPostIds = new Set(userBookmarks.map((b) => b.postId));
        return {
            posts: posts.map((post) => ({
                ...post,
                author: {
                    ...post.author,
                    fullName: `${post.author.firstName} ${post.author.lastName}`,
                },
                isLiked: likedPostIds.has(post.id),
                isBookmarked: bookmarkedPostIds.has(post.id),
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            query,
        };
    }
    /**
     * Record view when user actually scrolls to post (called from frontend)
     */
    static async recordPostView(userId, postId, duration) {
        // Check if already viewed
        const existing = await db.feedView.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        const isFirstView = !existing;
        // Get post author for points
        const post = await db.feedPost.findUnique({
            where: { id: postId },
            select: { authorId: true, viewsCount: true },
        });
        if (!post) {
            throw new Error("Post not found");
        }
        if (existing) {
            // Update duration if provided and longer than existing
            if (duration && (!existing.duration || duration > existing.duration)) {
                await db.feedView.update({
                    where: { id: existing.id },
                    data: { duration },
                });
            }
            // Award reduced points for repeat view
            await FeedPointsService.awardViewPoints(userId, postId, post.authorId, false);
            return {
                viewsCount: post.viewsCount,
                alreadyViewed: true,
                pointsEarned: 2, // Repeat view points
            };
        }
        // Create new view
        await db.feedView.create({
            data: {
                postId,
                userId,
                duration: duration ?? null,
            },
        });
        // Increment view count
        const updatedPost = await db.feedPost.update({
            where: { id: postId },
            data: { viewsCount: { increment: 1 } },
            select: { viewsCount: true },
        });
        // Award points for first view
        const pointsResult = await FeedPointsService.awardViewPoints(userId, postId, post.authorId, true);
        // Emit socket event
        await FeedSocketEmitter.emitViewIncremented(postId, updatedPost.viewsCount);
        // Emit points earned notification
        if (pointsResult) {
            await FeedSocketEmitter.emitPointsEarned(userId, pointsResult.viewerPoints, "Viewed post");
        }
        // Check and award badges
        await BadgeService.checkAndAwardBadges(userId);
        return {
            viewsCount: updatedPost.viewsCount,
            alreadyViewed: false,
            pointsEarned: pointsResult?.viewerPoints || 0,
        };
    }
}
//# sourceMappingURL=service.js.map