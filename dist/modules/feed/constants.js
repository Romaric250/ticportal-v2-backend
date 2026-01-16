/**
 * Feed Activity Point Rewards
 */
export const FEED_POINTS = {
    CREATE_POST: 100, // Creating a post
    RECEIVE_LIKE: 5, // When someone likes your post
    RECEIVE_COMMENT: 10, // When someone comments on your post
    LIKE_POST: 2, // Liking someone's post
    COMMENT_POST: 15, // Commenting on a post
    FIRST_POST_OF_DAY: 50, // Bonus for first post of the day
    POST_WITH_IMAGE: 20, // Bonus for adding images
    POST_WITH_VIDEO: 30, // Bonus for adding video
    VIRAL_POST: 200, // Post reaches 50+ likes
    POPULAR_POST: 100, // Post reaches 20+ likes
    ENGAGEMENT_MASTER: 150, // Post reaches 50+ comments
    BOOKMARK_RECEIVED: 3, // When someone bookmarks your post
    SHARE_POST: 5, // Sharing a post
    VIEW_POST_FIRST_TIME: 5, // First time viewing a post
    VIEW_POST_AGAIN: 2, // Viewing a post again
    VIEW_POST_RECEIVED: 1, // When someone views your post (to author)
};
/**
 * Activity types for feed actions
 */
export const FEED_ACTIVITIES = {
    POST_CREATED: "FEED_POST_CREATED",
    POST_UPDATED: "FEED_POST_UPDATED",
    POST_DELETED: "FEED_POST_DELETED",
    POST_LIKED: "FEED_POST_LIKED",
    POST_UNLIKED: "FEED_POST_UNLIKED",
    POST_BOOKMARKED: "FEED_POST_BOOKMARKED",
    POST_UNBOOKMARKED: "FEED_POST_UNBOOKMARKED",
    COMMENT_CREATED: "FEED_COMMENT_CREATED",
    COMMENT_UPDATED: "FEED_COMMENT_UPDATED",
    COMMENT_DELETED: "FEED_COMMENT_DELETED",
    COMMENT_LIKED: "FEED_COMMENT_LIKED",
    COMMENT_UNLIKED: "FEED_COMMENT_UNLIKED",
    POST_VIEWED: "FEED_POST_VIEWED",
    CONTENT_REPORTED: "FEED_CONTENT_REPORTED",
    POST_VIRAL: "FEED_POST_VIRAL",
    POST_POPULAR: "FEED_POST_POPULAR",
    POST_ENGAGEMENT_MASTER: "FEED_POST_ENGAGEMENT_MASTER",
};
/**
 * Feed Algorithm Configuration
 */
export const FEED_ALGORITHM = {
    // Default page size for infinite scroll
    DEFAULT_PAGE_SIZE: 10,
    // Feed ranking weights (adjustable for personalization)
    RANKING: {
        RECENCY_WEIGHT: 0.4, // 40% - Favor fresh content
        ENGAGEMENT_WEIGHT: 0.35, // 35% - High engagement posts
        DIVERSITY_WEIGHT: 0.15, // 15% - Mix of authors/categories
        PERSONALIZATION_WEIGHT: 0.10, // 10% - User preferences
    },
    // Engagement scoring
    ENGAGEMENT: {
        LIKE_SCORE: 1,
        COMMENT_SCORE: 3, // Comments worth more than likes
        VIEW_SCORE: 0.05, // Views have minimal impact
        BOOKMARK_SCORE: 2,
        SHARE_SCORE: 4, // Shares are most valuable
    },
    // Time decay configuration
    TIME_DECAY: {
        HALF_LIFE_HOURS: 24, // Content loses 50% weight after 24 hours
        MAX_AGE_DAYS: 30, // Don't show posts older than 30 days in main feed
    },
    // Diversity parameters
    DIVERSITY: {
        MAX_CONSECUTIVE_FROM_SAME_AUTHOR: 2,
        SHUFFLE_RANDOMNESS: 0.15, // 15% randomness to prevent echo chamber
    },
    // Trending calculation weights
    TRENDING: {
        LIKE_WEIGHT: 3,
        COMMENT_WEIGHT: 5,
        VIEW_WEIGHT: 1,
        BOOKMARK_WEIGHT: 2,
        TIME_DECAY_HOURS: 168, // 7 days
        MIN_ENGAGEMENT: 5, // Minimum interactions to be considered trending
    },
    // Latest posts config
    LATEST: {
        LIMIT: 3,
        MAX_AGE_DAYS: 7,
    },
    // Search config
    SEARCH: {
        MIN_QUERY_LENGTH: 2,
        MAX_RESULTS: 50,
        RELEVANCE_WEIGHTS: {
            TITLE_MATCH: 3,
            CONTENT_MATCH: 2,
            TAG_MATCH: 5,
            AUTHOR_MATCH: 1,
        },
    },
    // View tracking
    VIEW_TRACKING: {
        // Only count as viewed if user scrolls to it (frontend tracks this)
        MIN_VIEW_DURATION: 2, // seconds
        DEBOUNCE_INTERVAL: 5000, // ms - prevent duplicate views
    },
};
//# sourceMappingURL=constants.js.map