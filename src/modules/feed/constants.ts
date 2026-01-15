/**
 * Feed Activity Point Rewards
 */
export const FEED_POINTS = {
  CREATE_POST: 100,           // Creating a post
  RECEIVE_LIKE: 5,           // When someone likes your post
  RECEIVE_COMMENT: 10,       // When someone comments on your post
  LIKE_POST: 2,              // Liking someone's post
  COMMENT_POST: 15,          // Commenting on a post
  FIRST_POST_OF_DAY: 50,     // Bonus for first post of the day
  POST_WITH_IMAGE: 20,       // Bonus for adding images
  POST_WITH_VIDEO: 30,       // Bonus for adding video
  VIRAL_POST: 200,           // Post reaches 50+ likes
  POPULAR_POST: 100,         // Post reaches 20+ likes
  ENGAGEMENT_MASTER: 150,    // Post reaches 50+ comments
  BOOKMARK_RECEIVED: 3,      // When someone bookmarks your post
  SHARE_POST: 5,             // Sharing a post
} as const;

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
} as const;
