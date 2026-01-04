import { ActivityType } from "@prisma/client";
import { db } from "../../config/database";
import { logger } from "../utils/logger";
import {
  POINTS_CONFIG,
  ACTIVITY_TYPE_MAP,
  UNIQUE_ACTIVITIES,
  DAILY_LIMITS,
  getActivityPoints,
} from "../constants/points";

interface TrackActivityOptions {
  userId: string;
  action: string;
  metadata?: Record<string, unknown>;
  awardPoints?: boolean;
}

interface AwardPointsOptions {
  userId: string;
  amount: number;
  reason: string;
  activity: string;
  metadata?: Record<string, unknown>;
}

class ActivityService {
  /**
   * Track a user activity and optionally award points
   */
  async trackActivity({
    userId,
    action,
    metadata = {},
    awardPoints = true,
  }: TrackActivityOptions): Promise<void> {
    try {
      // Determine activity type
      const type = ACTIVITY_TYPE_MAP[action] || "AUTH";

      // Determine points to award
      let pointsAwarded = 0;
      if (awardPoints) {
        pointsAwarded = await this.calculatePoints(userId, type, action);
      }

      // Create activity record
      await db.userActivity.create({
        data: {
          userId,
          type,
          action,
          metadata: metadata as any,
          pointsAwarded,
        },
      });

      // Award points if applicable
      if (pointsAwarded > 0) {
        await this.awardPoints({
          userId,
          amount: pointsAwarded,
          reason: action,
          activity: type,
          metadata,
        });
      }

      logger.info({
        userId,
        action,
        type,
        pointsAwarded,
        msg: "Activity tracked",
      });
    } catch (error) {
      logger.error({ error, userId, action }, "Failed to track activity");
      // Don't throw - activity tracking should not break main flow
    }
  }

  /**
   * Calculate points for an activity, considering limits and duplicates
   */
  private async calculatePoints(
    userId: string,
    type: ActivityType,
    action: string,
  ): Promise<number> {
    // Get base points for this action
    const basePoints = getActivityPoints(type, action);
    if (basePoints === 0) return 0;

    // Check if this is a unique activity (should only happen once)
    if (UNIQUE_ACTIVITIES.includes(action)) {
      const exists = await db.userActivity.findFirst({
        where: {
          userId,
          action,
        },
      });

      if (exists) {
        logger.debug(
          { userId, action },
          "Skipping points - activity already completed",
        );
        return 0;
      }
    }

    // Check daily limits for repeated activities
    if (Object.keys(DAILY_LIMITS).includes(action)) {
      const limit = DAILY_LIMITS[action as keyof typeof DAILY_LIMITS];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayPoints = await db.userActivity.aggregate({
        where: {
          userId,
          action,
          createdAt: { gte: today },
        },
        _sum: {
          pointsAwarded: true,
        },
      });

      const currentTotal = todayPoints._sum.pointsAwarded || 0;
      if (currentTotal >= limit) {
        logger.debug(
          { userId, action, currentTotal, limit },
          "Daily limit reached for activity",
        );
        return 0;
      }
    }

    return basePoints;
  }

  /**
   * Award points to a user
   */
  private async awardPoints({
    userId,
    amount,
    reason,
    activity,
    metadata,
  }: AwardPointsOptions): Promise<void> {
    try {
      await db.point.create({
        data: {
          userId,
          amount,
          reason,
          activity,
        },
      });

      logger.info({ userId, amount, reason }, "Points awarded");
    } catch (error) {
      logger.error({ error, userId, amount }, "Failed to award points");
    }
  }

  /**
   * Get user's total points
   */
  async getUserPoints(userId: string): Promise<number> {
    const result = await db.point.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get user's activity history
   */
  async getUserActivities(
    userId: string,
    limit = 50,
    type?: ActivityType,
  ): Promise<unknown[]> {
    return db.userActivity.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Get user's points history
   */
  async getUserPointsHistory(userId: string, limit = 50): Promise<unknown[]> {
    return db.point.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Track authentication activities
   */
  async trackAuthActivity(
    userId: string,
    action: "REGISTER" | "EMAIL_VERIFICATION" | "LOGIN" | "LOGOUT" | "PROFILE_UPDATE",
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.trackActivity({
      userId,
      action,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track learning activities
   */
  async trackLearningActivity(
    userId: string,
    action: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.trackActivity({
      userId,
      action,
      metadata: metadata || {},
    });
  }

  /**
   * Manually award bonus points (admin action)
   */
  async awardBonusPoints(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    await this.awardPoints({
      userId,
      amount,
      reason,
      activity: "BONUS",
    });
  }
}

export const activityService = new ActivityService();
