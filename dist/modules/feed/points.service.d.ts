export declare class FeedPointsService {
    /**
     * Award points for creating a post
     */
    static awardPostCreationPoints(userId: string, postId: string, hasImages: boolean, hasVideo: boolean): Promise<{
        points: number;
        reasons: string[];
    } | undefined>;
    /**
     * Award points when someone likes a post (to post author)
     */
    static awardLikeReceivedPoints(postAuthorId: string, postId: string, likerId: string): Promise<{
        points: 5;
    } | undefined>;
    /**
     * Award points to the liker
     */
    static awardLikeGivenPoints(userId: string, postId: string): Promise<{
        points: 2;
    } | undefined>;
    /**
     * Award points when someone comments on a post (to post author)
     */
    static awardCommentReceivedPoints(postAuthorId: string, postId: string, commenterId: string): Promise<{
        points: 10;
    } | undefined>;
    /**
     * Award points to the commenter
     */
    static awardCommentGivenPoints(userId: string, postId: string, commentId: string): Promise<{
        points: 15;
    } | undefined>;
    /**
     * Award points when someone bookmarks a post
     */
    static awardBookmarkReceivedPoints(postAuthorId: string, postId: string, bookmarkerId: string): Promise<{
        points: 3;
    } | undefined>;
    /**
     * Check post milestones and award bonus points
     */
    static checkPostMilestones(postId: string, authorId: string): Promise<{
        reached: boolean;
        points: number;
        reason: string;
        activity: string;
    }[] | undefined>;
    /**
     * Track post view (no points, just analytics)
     */
    static trackPostView(userId: string, postId: string, duration?: number): Promise<void>;
    /**
     * Get user's feed points summary
     */
    static getUserFeedPointsSummary(userId: string): Promise<{
        totalPoints: number;
        breakdown: {
            activity: string | null;
            points: number;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=points.service.d.ts.map