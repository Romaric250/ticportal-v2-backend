import { db } from "../../config/database";
import { logger } from "../utils/logger";
import { POINTS_CONFIG, ACTIVITY_COOLDOWN, DAILY_LIMITS } from "../constants/points";
import type { ActivityType } from "@prisma/client";

interface AwardPointsParams {
  userId: string;
  activityType: ActivityType;
  action: string;
  points: number;
  reason: string;
  metadata?: Record<string, any>;
}

interface CheckCooldownParams {
  userId: string;
  action: string;
  cooldownMs: number;
}

export class PointsService {
  /**
   * Award points to a user for completing an activity
   */
  static async awardPoints(params: AwardPointsParams): Promise<boolean> {
    const { userId, activityType, action, points, reason, metadata } = params;

    try {
      // Check if activity has a cooldown
      if (action === "DAILY_LOGIN") {
        const canAward = await this.checkCooldown({
          userId,
          action,
          cooldownMs: ACTIVITY_COOLDOWN.DAILY_LOGIN,
        });
        if (!canAward) {
          logger.debug(`Cooldown active for ${action} by user ${userId}`);
          return false;
        }
      }

      // Check daily limits
      if (action === "MESSAGE_SENT") {
        const todayPoints = await this.getTodayPoints(userId, action);
        if (todayPoints >= DAILY_LIMITS.MESSAGE_SENT) {
          logger.debug(`Daily limit reached for ${action} by user ${userId}`);
          return false;
        }
      }

      // Award points in a transaction
      await db.$transaction(async (tx) => {
        // Create point record
        await tx.point.create({
          data: {
            userId,
            amount: points,
            reason,
            activity: action,
          },
        });

        // Log activity
        await tx.userActivity.create({
          data: {
            userId,
            type: activityType,
            action,
            pointsAwarded: points,
            metadata: metadata || {},
          },
        });

        logger.info(
          `Awarded ${points} points to user ${userId} for ${action}`,
        );
      });

      return true;
    } catch (error) {
      logger.error({ error, userId, action }, "Failed to award points");
      return false;
    }
  }

  /**
   * Check if user can perform action based on cooldown
   */
  private static async checkCooldown(
    params: CheckCooldownParams,
  ): Promise<boolean> {
    const { userId, action, cooldownMs } = params;

    const lastActivity = await db.userActivity.findFirst({
      where: {
        userId,
        action,
        createdAt: {
          gte: new Date(Date.now() - cooldownMs),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return !lastActivity;
  }

  /**
   * Get total points awarded today for a specific action
   */
  private static async getTodayPoints(
    userId: string,
    action: string,
  ): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await db.userActivity.findMany({
      where: {
        userId,
        action,
        createdAt: {
          gte: today,
        },
      },
    });

    return activities.reduce((sum, activity) => sum + activity.pointsAwarded, 0);
  }

  /**
   * Get total points for a user
   */
  static async getUserTotalPoints(userId: string): Promise<number> {
    const result = await db.point.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  /**
   * Get user's point history
   */
  static async getUserPointHistory(userId: string, limit = 50) {
    return db.point.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Get user's activity history
   */
  static async getUserActivityHistory(
    userId: string,
    activityType?: ActivityType,
    limit = 50,
  ) {
    return db.userActivity.findMany({
      where: {
        userId,
        ...(activityType && { type: activityType }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Award points for daily login
   */
  static async awardDailyLogin(userId: string): Promise<boolean> {
    return this.awardPoints({
      userId,
      activityType: "AUTH",
      action: "LOGIN",
      points: POINTS_CONFIG.AUTH.LOGIN,
      reason: "Daily login bonus",
    });
  }

  /**
   * Award points for email verification
   */
  static async awardEmailVerification(userId: string): Promise<boolean> {
    return this.awardPoints({
      userId,
      activityType: "AUTH",
      action: "EMAIL_VERIFICATION",
      points: POINTS_CONFIG.AUTH.EMAIL_VERIFICATION,
      reason: "Email verified",
    });
  }

  /**
   * Award points for completing a stage
   */
  static async awardStageCompletion(
    userId: string,
    stageId: string,
    stageName: string,
  ): Promise<boolean> {
    return this.awardPoints({
      userId,
      activityType: "LEARNING",
      action: "STAGE_COMPLETE",
      points: POINTS_CONFIG.LEARNING.STAGE_COMPLETE,
      reason: `Completed stage: ${stageName}`,
      metadata: { stageId, stageName },
    });
  }

  /**
   * Award points for passing a quiz
   */
  static async awardQuizCompletion(
    userId: string,
    quizId: string,
    score: number,
    maxScore: number,
  ): Promise<boolean> {
    const isPerfect = score === maxScore;
    const points = isPerfect
      ? POINTS_CONFIG.LEARNING.QUIZ_PERFECT_SCORE
      : POINTS_CONFIG.LEARNING.QUIZ_PASS;

    return this.awardPoints({
      userId,
      activityType: "LEARNING",
      action: isPerfect ? "QUIZ_PERFECT_SCORE" : "QUIZ_PASS",
      points,
      reason: isPerfect ? "Perfect quiz score!" : "Quiz passed",
      metadata: { quizId, score, maxScore },
    });
  }

  /**
   * Award points for earning a badge
   */
  static async awardBadgeEarned(
    userId: string,
    badgeId: string,
    badgeName: string,
  ): Promise<boolean> {
    return this.awardPoints({
      userId,
      activityType: "GAMIFICATION",
      action: "BADGE_EARNED",
      points: POINTS_CONFIG.GAMIFICATION.BADGE_EARNED,
      reason: `Earned badge: ${badgeName}`,
      metadata: { badgeId, badgeName },
    });
  }

  /**
   * Award points for hackathon submission
   */
  static async awardHackathonSubmission(
    userId: string,
    hackathonId: string,
    isOnTime: boolean,
  ): Promise<boolean> {
    const basePoints = POINTS_CONFIG.HACKATHON.SUBMISSION;
    const bonusPoints = isOnTime ? POINTS_CONFIG.HACKATHON.SUBMISSION_ON_TIME : 0;
    const totalPoints = basePoints + bonusPoints;

    return this.awardPoints({
      userId,
      activityType: "HACKATHON",
      action: "SUBMISSION",
      points: totalPoints,
      reason: isOnTime
        ? "Hackathon submission (on time bonus!)"
        : "Hackathon submission",
      metadata: { hackathonId, isOnTime },
    });
  }
}
