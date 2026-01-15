import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { activityService } from "../../shared/services/activity";
import { FEED_POINTS, FEED_ACTIVITIES } from "./constants";

export class FeedPointsService {
  /**
   * Award points for creating a post
   */
  static async awardPostCreationPoints(userId: string, postId: string, hasImages: boolean, hasVideo: boolean) {
    try {
      let totalPoints = FEED_POINTS.CREATE_POST;
      const reasons: string[] = ["Created a post"];

      // Bonus for adding media
      if (hasImages) {
        totalPoints += FEED_POINTS.POST_WITH_IMAGE;
        reasons.push("Added images");
      }
      if (hasVideo) {
        totalPoints += FEED_POINTS.POST_WITH_VIDEO;
        reasons.push("Added video");
      }

      // Check if this is the first post of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const postsToday = await db.feedPost.count({
        where: {
          authorId: userId,
          createdAt: {
            gte: today,
          },
        },
      });

      if (postsToday === 1) {
        totalPoints += FEED_POINTS.FIRST_POST_OF_DAY;
        reasons.push("First post of the day bonus");
      }

      // Award points
      await db.point.create({
        data: {
          userId,
          amount: totalPoints,
          reason: reasons.join(", "),
          activity: FEED_ACTIVITIES.POST_CREATED,
        },
      });

      // Track activity
      await activityService.trackActivity({
        userId,
        action: FEED_ACTIVITIES.POST_CREATED,
        metadata: {
          postId,
          pointsAwarded: totalPoints,
          reasons,
        },
      });

      logger.info({
        userId,
        postId,
        points: totalPoints,
        reasons,
      }, "Post creation points awarded");

      return { points: totalPoints, reasons };
    } catch (error) {
      logger.error({ error, userId, postId }, "Failed to award post creation points");
      // Don't throw - points should not break the main flow
    }
  }

  /**
   * Award points when someone likes a post (to post author)
   */
  static async awardLikeReceivedPoints(postAuthorId: string, postId: string, likerId: string) {
    try {
      // Don't award points for self-likes
      if (postAuthorId === likerId) {
        return;
      }

      const points = FEED_POINTS.RECEIVE_LIKE;

      await db.point.create({
        data: {
          userId: postAuthorId,
          amount: points,
          reason: "Post liked by someone",
          activity: FEED_ACTIVITIES.POST_LIKED,
        },
      });

      // Track activity
      await activityService.trackActivity({
        userId: postAuthorId,
        action: FEED_ACTIVITIES.POST_LIKED,
        metadata: {
          postId,
          likerId,
          pointsAwarded: points,
        },
      });

      // Check for milestone rewards (viral, popular)
      await this.checkPostMilestones(postId, postAuthorId);

      logger.info({ postAuthorId, postId, points }, "Like received points awarded");

      return { points };
    } catch (error) {
      logger.error({ error, postAuthorId, postId }, "Failed to award like received points");
    }
  }

  /**
   * Award points to the liker
   */
  static async awardLikeGivenPoints(userId: string, postId: string) {
    try {
      const points = FEED_POINTS.LIKE_POST;

      await db.point.create({
        data: {
          userId,
          amount: points,
          reason: "Liked a post",
          activity: FEED_ACTIVITIES.POST_LIKED,
        },
      });

      await activityService.trackActivity({
        userId,
        action: FEED_ACTIVITIES.POST_LIKED,
        metadata: {
          postId,
          pointsAwarded: points,
        },
      });

      return { points };
    } catch (error) {
      logger.error({ error, userId, postId }, "Failed to award like given points");
    }
  }

  /**
   * Award points when someone comments on a post (to post author)
   */
  static async awardCommentReceivedPoints(postAuthorId: string, postId: string, commenterId: string) {
    try {
      // Don't award points for self-comments
      if (postAuthorId === commenterId) {
        return;
      }

      const points = FEED_POINTS.RECEIVE_COMMENT;

      await db.point.create({
        data: {
          userId: postAuthorId,
          amount: points,
          reason: "Post received a comment",
          activity: FEED_ACTIVITIES.COMMENT_CREATED,
        },
      });

      await activityService.trackActivity({
        userId: postAuthorId,
        action: FEED_ACTIVITIES.COMMENT_CREATED,
        metadata: {
          postId,
          commenterId,
          pointsAwarded: points,
        },
      });

      // Check for engagement milestones
      await this.checkPostMilestones(postId, postAuthorId);

      logger.info({ postAuthorId, postId, points }, "Comment received points awarded");

      return { points };
    } catch (error) {
      logger.error({ error, postAuthorId, postId }, "Failed to award comment received points");
    }
  }

  /**
   * Award points to the commenter
   */
  static async awardCommentGivenPoints(userId: string, postId: string, commentId: string) {
    try {
      const points = FEED_POINTS.COMMENT_POST;

      await db.point.create({
        data: {
          userId,
          amount: points,
          reason: "Commented on a post",
          activity: FEED_ACTIVITIES.COMMENT_CREATED,
        },
      });

      await activityService.trackActivity({
        userId,
        action: FEED_ACTIVITIES.COMMENT_CREATED,
        metadata: {
          postId,
          commentId,
          pointsAwarded: points,
        },
      });

      return { points };
    } catch (error) {
      logger.error({ error, userId, postId }, "Failed to award comment given points");
    }
  }

  /**
   * Award points when someone bookmarks a post
   */
  static async awardBookmarkReceivedPoints(postAuthorId: string, postId: string, bookmarkerId: string) {
    try {
      // Don't award points for self-bookmarks
      if (postAuthorId === bookmarkerId) {
        return;
      }

      const points = FEED_POINTS.BOOKMARK_RECEIVED;

      await db.point.create({
        data: {
          userId: postAuthorId,
          amount: points,
          reason: "Post bookmarked by someone",
          activity: FEED_ACTIVITIES.POST_BOOKMARKED,
        },
      });

      await activityService.trackActivity({
        userId: postAuthorId,
        action: FEED_ACTIVITIES.POST_BOOKMARKED,
        metadata: {
          postId,
          bookmarkerId,
          pointsAwarded: points,
        },
      });

      return { points };
    } catch (error) {
      logger.error({ error, postAuthorId, postId }, "Failed to award bookmark received points");
    }
  }

  /**
   * Check post milestones and award bonus points
   */
  static async checkPostMilestones(postId: string, authorId: string) {
    try {
      const post = await db.feedPost.findUnique({
        where: { id: postId },
        select: {
          likesCount: true,
          commentsCount: true,
        },
      });

      if (!post) return;

      const milestones: Array<{ reached: boolean; points: number; reason: string; activity: string }> = [];

      // Check viral post (50+ likes) - only award once
      if (post.likesCount >= 50) {
        const alreadyAwarded = await db.point.findFirst({
          where: {
            userId: authorId,
            activity: FEED_ACTIVITIES.POST_VIRAL,
            reason: { contains: postId },
          },
        });

        if (!alreadyAwarded) {
          milestones.push({
            reached: true,
            points: FEED_POINTS.VIRAL_POST,
            reason: `Post went viral (${post.likesCount} likes)`,
            activity: FEED_ACTIVITIES.POST_VIRAL,
          });
        }
      }
      // Check popular post (20+ likes)
      else if (post.likesCount >= 20) {
        const alreadyAwarded = await db.point.findFirst({
          where: {
            userId: authorId,
            activity: FEED_ACTIVITIES.POST_POPULAR,
            reason: { contains: postId },
          },
        });

        if (!alreadyAwarded) {
          milestones.push({
            reached: true,
            points: FEED_POINTS.POPULAR_POST,
            reason: `Post became popular (${post.likesCount} likes)`,
            activity: FEED_ACTIVITIES.POST_POPULAR,
          });
        }
      }

      // Check engagement master (50+ comments)
      if (post.commentsCount >= 50) {
        const alreadyAwarded = await db.point.findFirst({
          where: {
            userId: authorId,
            activity: FEED_ACTIVITIES.POST_ENGAGEMENT_MASTER,
            reason: { contains: postId },
          },
        });

        if (!alreadyAwarded) {
          milestones.push({
            reached: true,
            points: FEED_POINTS.ENGAGEMENT_MASTER,
            reason: `Engagement master (${post.commentsCount} comments)`,
            activity: FEED_ACTIVITIES.POST_ENGAGEMENT_MASTER,
          });
        }
      }

      // Award milestone points
      for (const milestone of milestones) {
        if (milestone.reached) {
          await db.point.create({
            data: {
              userId: authorId,
              amount: milestone.points,
              reason: `${milestone.reason} - Post: ${postId}`,
              activity: milestone.activity,
            },
          });

          await activityService.trackActivity({
            userId: authorId,
            action: milestone.activity,
            metadata: {
              postId,
              pointsAwarded: milestone.points,
              milestone: milestone.reason,
            },
          });

          logger.info({
            authorId,
            postId,
            milestone: milestone.reason,
            points: milestone.points,
          }, "Milestone points awarded");
        }
      }

      return milestones.filter((m) => m.reached);
    } catch (error) {
      logger.error({ error, postId, authorId }, "Failed to check post milestones");
    }
  }

  /**
   * Track post view (no points, just analytics)
   */
  static async trackPostView(userId: string, postId: string, duration?: number) {
    try {
      await activityService.trackActivity({
        userId,
        action: FEED_ACTIVITIES.POST_VIEWED,
        metadata: {
          postId,
          duration,
        },
      });
    } catch (error) {
      logger.error({ error, userId, postId }, "Failed to track post view");
    }
  }

  /**
   * Get user's feed points summary
   */
  static async getUserFeedPointsSummary(userId: string) {
    try {
      const feedActivities = Object.values(FEED_ACTIVITIES);

      const points = await db.point.aggregate({
        where: {
          userId,
          activity: {
            in: feedActivities,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const breakdown = await db.point.groupBy({
        by: ["activity"],
        where: {
          userId,
          activity: {
            in: feedActivities,
          },
        },
        _sum: {
          amount: true,
        },
        _count: true,
      });

      return {
        totalPoints: points._sum.amount || 0,
        breakdown: breakdown.map((item) => ({
          activity: item.activity,
          points: item._sum.amount || 0,
          count: item._count,
        })),
      };
    } catch (error) {
      logger.error({ error, userId }, "Failed to get user feed points summary");
      return {
        totalPoints: 0,
        breakdown: [],
      };
    }
  }
}
