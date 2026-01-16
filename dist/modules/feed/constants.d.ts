/**
 * Feed Activity Point Rewards
 */
export declare const FEED_POINTS: {
    readonly CREATE_POST: 100;
    readonly RECEIVE_LIKE: 5;
    readonly RECEIVE_COMMENT: 10;
    readonly LIKE_POST: 2;
    readonly COMMENT_POST: 15;
    readonly FIRST_POST_OF_DAY: 50;
    readonly POST_WITH_IMAGE: 20;
    readonly POST_WITH_VIDEO: 30;
    readonly VIRAL_POST: 200;
    readonly POPULAR_POST: 100;
    readonly ENGAGEMENT_MASTER: 150;
    readonly BOOKMARK_RECEIVED: 3;
    readonly SHARE_POST: 5;
    readonly VIEW_POST_FIRST_TIME: 5;
    readonly VIEW_POST_AGAIN: 2;
    readonly VIEW_POST_RECEIVED: 1;
};
/**
 * Activity types for feed actions
 */
export declare const FEED_ACTIVITIES: {
    readonly POST_CREATED: "FEED_POST_CREATED";
    readonly POST_UPDATED: "FEED_POST_UPDATED";
    readonly POST_DELETED: "FEED_POST_DELETED";
    readonly POST_LIKED: "FEED_POST_LIKED";
    readonly POST_UNLIKED: "FEED_POST_UNLIKED";
    readonly POST_BOOKMARKED: "FEED_POST_BOOKMARKED";
    readonly POST_UNBOOKMARKED: "FEED_POST_UNBOOKMARKED";
    readonly COMMENT_CREATED: "FEED_COMMENT_CREATED";
    readonly COMMENT_UPDATED: "FEED_COMMENT_UPDATED";
    readonly COMMENT_DELETED: "FEED_COMMENT_DELETED";
    readonly COMMENT_LIKED: "FEED_COMMENT_LIKED";
    readonly COMMENT_UNLIKED: "FEED_COMMENT_UNLIKED";
    readonly POST_VIEWED: "FEED_POST_VIEWED";
    readonly CONTENT_REPORTED: "FEED_CONTENT_REPORTED";
    readonly POST_VIRAL: "FEED_POST_VIRAL";
    readonly POST_POPULAR: "FEED_POST_POPULAR";
    readonly POST_ENGAGEMENT_MASTER: "FEED_POST_ENGAGEMENT_MASTER";
};
/**
 * Feed Algorithm Configuration
 */
export declare const FEED_ALGORITHM: {
    readonly DEFAULT_PAGE_SIZE: 10;
    readonly RANKING: {
        readonly RECENCY_WEIGHT: 0.4;
        readonly ENGAGEMENT_WEIGHT: 0.35;
        readonly DIVERSITY_WEIGHT: 0.15;
        readonly PERSONALIZATION_WEIGHT: 0.1;
    };
    readonly ENGAGEMENT: {
        readonly LIKE_SCORE: 1;
        readonly COMMENT_SCORE: 3;
        readonly VIEW_SCORE: 0.05;
        readonly BOOKMARK_SCORE: 2;
        readonly SHARE_SCORE: 4;
    };
    readonly TIME_DECAY: {
        readonly HALF_LIFE_HOURS: 24;
        readonly MAX_AGE_DAYS: 30;
    };
    readonly DIVERSITY: {
        readonly MAX_CONSECUTIVE_FROM_SAME_AUTHOR: 2;
        readonly SHUFFLE_RANDOMNESS: 0.15;
    };
    readonly TRENDING: {
        readonly LIKE_WEIGHT: 3;
        readonly COMMENT_WEIGHT: 5;
        readonly VIEW_WEIGHT: 1;
        readonly BOOKMARK_WEIGHT: 2;
        readonly TIME_DECAY_HOURS: 168;
        readonly MIN_ENGAGEMENT: 5;
    };
    readonly LATEST: {
        readonly LIMIT: 3;
        readonly MAX_AGE_DAYS: 7;
    };
    readonly SEARCH: {
        readonly MIN_QUERY_LENGTH: 2;
        readonly MAX_RESULTS: 50;
        readonly RELEVANCE_WEIGHTS: {
            readonly TITLE_MATCH: 3;
            readonly CONTENT_MATCH: 2;
            readonly TAG_MATCH: 5;
            readonly AUTHOR_MATCH: 1;
        };
    };
    readonly VIEW_TRACKING: {
        readonly MIN_VIEW_DURATION: 2;
        readonly DEBOUNCE_INTERVAL: 5000;
    };
};
//# sourceMappingURL=constants.d.ts.map