import { ActivityType } from "@prisma/client";
import { db } from "../../config/database";
import { logger } from "../utils/logger";
import { POINTS_CONFIG, ACTIVITY_TYPE_MAP, UNIQUE_ACTIVITIES, DAILY_LIMITS, getActivityPoints, } from "../constants/points";
class ActivityService {
    /**
     * Track a user activity and optionally award points
     */
    async trackActivity({ userId, action, metadata = {}, awardPoints = true, }) {
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
                    metadata: metadata,
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
        }
        catch (error) {
            logger.error({ error, userId, action }, "Failed to track activity");
            // Don't throw - activity tracking should not break main flow
        }
    }
    /**
     * Calculate points for an activity, considering limits and duplicates
     */
    async calculatePoints(userId, type, action) {
        // Get base points for this action
        const basePoints = getActivityPoints(type, action);
        if (basePoints === 0)
            return 0;
        // Check if this is a unique activity (should only happen once)
        if (UNIQUE_ACTIVITIES.includes(action)) {
            const exists = await db.userActivity.findFirst({
                where: {
                    userId,
                    action,
                },
            });
            if (exists) {
                logger.debug({ userId, action }, "Skipping points - activity already completed");
                return 0;
            }
        }
        // Check daily limits for repeated activities
        if (Object.keys(DAILY_LIMITS).includes(action)) {
            const limit = DAILY_LIMITS[action];
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
                logger.debug({ userId, action, currentTotal, limit }, "Daily limit reached for activity");
                return 0;
            }
        }
        return basePoints;
    }
    /**
     * Award points to a user
     */
    async awardPoints({ userId, amount, reason, activity, metadata, }) {
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
        }
        catch (error) {
            logger.error({ error, userId, amount }, "Failed to award points");
        }
    }
    /**
     * Get user's total points
     */
    async getUserPoints(userId) {
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
    async getUserActivities(userId, limit = 50, type) {
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
    async getUserPointsHistory(userId, limit = 50) {
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
    async trackAuthActivity(userId, action, metadata) {
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
    async trackLearningActivity(userId, action, metadata) {
        await this.trackActivity({
            userId,
            action,
            metadata: metadata || {},
        });
    }
    /**
     * Manually award bonus points (admin action)
     */
    async awardBonusPoints(userId, amount, reason) {
        await this.awardPoints({
            userId,
            amount,
            reason,
            activity: "BONUS",
        });
    }
}
export const activityService = new ActivityService();
//# sourceMappingURL=activity.js.map