import type { CreatePostInput, UpdatePostInput, GetPostsInput, CreateCommentInput, UpdateCommentInput, ReportContentInput, PinPostInput, RecordViewInput } from "./types";
import type { UserRole } from "@prisma/client";
export declare class FeedService {
    /**
     * Get posts with advanced filtering and pagination + SMART ALGORITHM
     */
    static getPosts(userId: string, userRole: UserRole, input: GetPostsInput): Promise<{
        posts: any[];
        pinnedPosts: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * 🔥 SMART RANKING ALGORITHM
     * Balances recency, engagement, and diversity
     */
    private static rankPosts;
    /**
     * Apply diversity filter to prevent author repetition
     */
    private static applyDiversityFilter;
    /**
     * Get single post by ID
     */
    static getPostById(userId: string, postId: string): Promise<{
        author: {
            fullName: string;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            bio: string | null;
            profilePhoto: string | null;
        };
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        isLiked: boolean;
        isBookmarked: boolean;
        _count: undefined;
        attachments: {
            id: string;
            createdAt: Date;
            postId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            fileType: string;
        }[];
        team: {
            id: string;
            name: string;
            profileImage: string | null;
        } | null;
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        sharesCount: number;
        publishedAt: Date | null;
    }>;
    /**
     * Create a new post
     */
    static createPost(userId: string, userRole: UserRole, input: CreatePostInput): Promise<{
        attachments: {
            id: string;
            createdAt: Date;
            postId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            fileType: string;
        }[];
        author: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        publishedAt: Date | null;
    }>;
    /**
     * Update a post
     */
    static updatePost(userId: string, userRole: UserRole, postId: string, input: UpdatePostInput): Promise<{
        attachments: {
            id: string;
            createdAt: Date;
            postId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            fileType: string;
        }[];
        author: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        publishedAt: Date | null;
    }>;
    /**
     * Delete a post
     */
    static deletePost(userId: string, userRole: UserRole, postId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Pin or unpin a post (Admin only)
     */
    static pinPost(userId: string, userRole: UserRole, postId: string, input: PinPostInput): Promise<{
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        publishedAt: Date | null;
    }>;
    /**
     * Toggle like on a post
     */
    static togglePostLike(userId: string, postId: string): Promise<{
        isLiked: boolean;
    }>;
    /**
     * Get users who liked a post
     */
    static getPostLikes(postId: string, page?: number, limit?: number): Promise<{
        users: {
            fullName: string;
            likedAt: Date;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get comments for a post
     */
    static getComments(userId: string, postId: string, page?: number, limit?: number): Promise<{
        comments: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Create a comment
     */
    static createComment(userId: string, postId: string, input: CreateCommentInput): Promise<{
        author: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        authorId: string;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        parentId: string | null;
        repliesCount: number;
    }>;
    /**
     * Update a comment
     */
    static updateComment(userId: string, userRole: UserRole, commentId: string, input: UpdateCommentInput): Promise<{
        author: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        authorId: string;
        content: string;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        parentId: string | null;
        repliesCount: number;
    }>;
    /**
     * Delete a comment
     */
    static deleteComment(userId: string, userRole: UserRole, commentId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Toggle like on a comment
     */
    static toggleCommentLike(userId: string, commentId: string): Promise<{
        isLiked: boolean;
    }>;
    /**
     * Record a view (idempotent)
     */
    static recordView(userId: string, input: RecordViewInput): Promise<{
        viewsCount: number;
    }>;
    /**
     * Toggle bookmark
     */
    static toggleBookmark(userId: string, postId: string): Promise<{
        isBookmarked: boolean;
    }>;
    /**
     * Get user's bookmarked posts
     */
    static getBookmarks(userId: string, page?: number, limit?: number): Promise<{
        posts: ({
            attachments: {
                id: string;
                createdAt: Date;
                postId: string;
                fileName: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                fileType: string;
            }[];
            author: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            tags: string[];
            title: string | null;
            status: import(".prisma/client").$Enums.FeedPostStatus;
            updatedAt: Date;
            teamId: string | null;
            category: import(".prisma/client").$Enums.FeedCategory;
            isPinned: boolean;
            authorId: string;
            content: string;
            imageUrls: string[];
            videoUrl: string | null;
            visibility: import(".prisma/client").$Enums.FeedVisibility;
            pinnedAt: Date | null;
            pinnedBy: string | null;
            isOfficial: boolean;
            isEdited: boolean;
            editedAt: Date | null;
            likesCount: number;
            commentsCount: number;
            viewsCount: number;
            sharesCount: number;
            publishedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Report content
     */
    static reportContent(userId: string, input: ReportContentInput): Promise<{
        id: string;
        createdAt: Date;
        reason: import(".prisma/client").$Enums.FeedReportReason;
        status: import(".prisma/client").$Enums.FeedReportStatus;
        updatedAt: Date;
        description: string | null;
        postId: string | null;
        commentId: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        resolution: string | null;
        reporterId: string;
    }>;
    /**
     * Get trending tags
     */
    static getTrendingTags(limit?: number): Promise<{
        tag: string;
        count: number;
    }[]>;
    /**
     * Get trending posts (based on engagement in last 7 days)
     */
    static getTrendingPosts(userId: string, userRole: UserRole, limit?: number): Promise<{
        author: {
            fullName: string;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
        isLiked: boolean;
        isBookmarked: boolean;
        trendingScore: undefined;
        attachments: {
            id: string;
            createdAt: Date;
            postId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            fileType: string;
        }[];
        team: {
            id: string;
            name: string;
            profileImage: string | null;
        } | null;
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        publishedAt: Date | null;
    }[]>;
    /**
     * Get latest posts
     */
    static getLatestPosts(userId: string, userRole: UserRole, limit?: number): Promise<{
        author: {
            fullName: string;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        };
        isLiked: boolean;
        isBookmarked: boolean;
        attachments: {
            id: string;
            createdAt: Date;
            postId: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            mimeType: string;
            fileType: string;
        }[];
        team: {
            id: string;
            name: string;
            profileImage: string | null;
        } | null;
        id: string;
        createdAt: Date;
        tags: string[];
        title: string | null;
        status: import(".prisma/client").$Enums.FeedPostStatus;
        updatedAt: Date;
        teamId: string | null;
        category: import(".prisma/client").$Enums.FeedCategory;
        isPinned: boolean;
        authorId: string;
        content: string;
        imageUrls: string[];
        videoUrl: string | null;
        visibility: import(".prisma/client").$Enums.FeedVisibility;
        pinnedAt: Date | null;
        pinnedBy: string | null;
        isOfficial: boolean;
        isEdited: boolean;
        editedAt: Date | null;
        likesCount: number;
        commentsCount: number;
        viewsCount: number;
        sharesCount: number;
        publishedAt: Date | null;
    }[]>;
    /**
     * Search posts
     */
    static searchPosts(userId: string, userRole: UserRole, query: string, page?: number, limit?: number): Promise<{
        posts: {
            author: {
                fullName: string;
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                firstName: string;
                lastName: string;
                profilePhoto: string | null;
            };
            isLiked: boolean;
            isBookmarked: boolean;
            attachments: {
                id: string;
                createdAt: Date;
                postId: string;
                fileName: string;
                fileUrl: string;
                fileSize: number;
                mimeType: string;
                fileType: string;
            }[];
            team: {
                id: string;
                name: string;
                profileImage: string | null;
            } | null;
            id: string;
            createdAt: Date;
            tags: string[];
            title: string | null;
            status: import(".prisma/client").$Enums.FeedPostStatus;
            updatedAt: Date;
            teamId: string | null;
            category: import(".prisma/client").$Enums.FeedCategory;
            isPinned: boolean;
            authorId: string;
            content: string;
            imageUrls: string[];
            videoUrl: string | null;
            visibility: import(".prisma/client").$Enums.FeedVisibility;
            pinnedAt: Date | null;
            pinnedBy: string | null;
            isOfficial: boolean;
            isEdited: boolean;
            editedAt: Date | null;
            likesCount: number;
            commentsCount: number;
            viewsCount: number;
            sharesCount: number;
            publishedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        query: string;
    }>;
    /**
     * Record view when user actually scrolls to post (called from frontend)
     */
    static recordPostView(userId: string, postId: string, duration?: number): Promise<{
        viewsCount: number;
        alreadyViewed: boolean;
        pointsEarned: number;
    }>;
}
//# sourceMappingURL=service.d.ts.map