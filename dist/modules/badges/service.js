import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
import { BADGES, ALL_BADGES } from "./badges.js";
import { PaymentStatus } from "@prisma/client";
import { sendBadgeEarnedEmail } from "../../shared/utils/email.js";
export class BadgeService {
    /**
     * Check and award badges to user based on their activity
     */
    static async checkAndAwardBadges(userId) {
        try {
            const newBadges = [];
            // Get user's current badges
            const userBadges = await db.userBadge.findMany({
                where: { userId },
                select: { badgeId: true },
            });
            const earnedBadgeIds = new Set(userBadges.map((b) => b.badgeId));
            // Get user stats
            const stats = await this.getUserStats(userId);
            // Check each badge
            for (const badge of ALL_BADGES) {
                // Skip if already earned
                if (earnedBadgeIds.has(badge.id))
                    continue;
                // Check if requirements are met
                const earned = await this.checkBadgeRequirement(userId, badge, stats);
                if (earned) {
                    await this.awardBadge(userId, badge.id);
                    newBadges.push(badge.id);
                    logger.info({ userId, badgeId: badge.id }, "Badge awarded");
                }
            }
            return newBadges;
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to check and award badges");
            return [];
        }
    }
    /**
     * Get user statistics for badge checking
     */
    static async getUserStats(userId) {
        const [user, totalPoints, postsCreated, likesGiven, commentsGiven, teamsJoined, postsViewed, maxPostLikes, maxPostComments, teamMembersCount, deliverablesSubmitted, paymentsCompleted,] = await Promise.all([
            // User info
            db.user.findUnique({
                where: { id: userId },
                select: { createdAt: true },
            }),
            // Total points
            db.point.aggregate({
                where: { userId },
                _sum: { amount: true },
            }),
            // Posts created
            db.feedPost.count({
                where: { authorId: userId },
            }),
            // Likes given
            db.feedLike.count({
                where: { userId },
            }),
            // Comments given
            db.feedComment.count({
                where: { authorId: userId },
            }),
            // Teams joined
            db.teamMember.count({
                where: { userId },
            }),
            // Posts viewed
            db.feedView.count({
                where: { userId },
            }),
            // Max likes on a single post
            db.feedPost.findFirst({
                where: { authorId: userId },
                orderBy: { likesCount: "desc" },
                select: { likesCount: true },
            }),
            // Max comments on a single post
            db.feedPost.findFirst({
                where: { authorId: userId },
                orderBy: { commentsCount: "desc" },
                select: { commentsCount: true },
            }),
            // Team members count (for teams user leads)
            db.teamMember.count({
                where: {
                    team: {
                        members: {
                            some: {
                                userId,
                                role: "LEAD",
                            },
                        },
                    },
                },
            }),
            // Deliverables submitted (placeholder - adjust based on your schema)
            Promise.resolve(0), // TODO: Implement when deliverables module exists
            // Payments completed (confirmed payments)
            db.payment.count({
                where: {
                    userId,
                    status: 'CONFIRMED'
                }
            }),
        ]);
        // Learning paths completed
        const learningPathsCompleted = await db.learningPathCompletion.count({
            where: { userId },
        });
        return {
            totalPoints: totalPoints._sum.amount || 0,
            postsCreated,
            likesGiven,
            commentsGiven,
            teamsJoined,
            postsViewed,
            maxPostLikes: maxPostLikes?.likesCount || 0,
            maxPostComments: maxPostComments?.commentsCount || 0,
            teamMembersCount,
            deliverablesSubmitted,
            paymentsCompleted: paymentsCompleted || 0,
            accountAge: user ? Date.now() - user.createdAt.getTime() : 0,
            learningPathsCompleted,
        };
    }
    /**
     * Check if badge requirement is met
     */
    static async checkBadgeRequirement(userId, badge, stats) {
        const { type, value } = badge.requirement;
        switch (type) {
            case "TOTAL_POINTS":
                return stats.totalPoints >= value;
            case "POSTS_CREATED":
                return stats.postsCreated >= value;
            case "LIKES_GIVEN":
                return stats.likesGiven >= value;
            case "COMMENTS_GIVEN":
                return stats.commentsGiven >= value;
            case "TEAMS_JOINED":
                return stats.teamsJoined >= value;
            case "POSTS_VIEWED":
                return stats.postsViewed >= value;
            case "POST_LIKES":
                return stats.maxPostLikes >= value;
            case "POST_COMMENTS":
                return stats.maxPostComments >= value;
            case "TEAM_MEMBERS":
                return stats.teamMembersCount >= value;
            case "DELIVERABLES_SUBMITTED":
                return stats.deliverablesSubmitted >= value;
            case "LEARNING_PATHS_COMPLETED":
                return stats.learningPathsCompleted >= value;
            case "PAYMENT_SUCCESS":
                return stats.paymentsCompleted >= value;
            case "EARLY_POST":
                // Check if user posted within 1 hour of registration
                const user = await db.user.findUnique({
                    where: { id: userId },
                    select: { createdAt: true },
                });
                const firstPost = await db.feedPost.findFirst({
                    where: { authorId: userId },
                    orderBy: { createdAt: "asc" },
                    select: { createdAt: true },
                });
                if (!user || !firstPost)
                    return false;
                const timeDiff = firstPost.createdAt.getTime() - user.createdAt.getTime();
                return timeDiff <= 60 * 60 * 1000; // 1 hour
            case "NIGHT_POST":
                // Check if user has posted between midnight and 4 AM
                const nightPost = await db.feedPost.findFirst({
                    where: { authorId: userId },
                });
                if (!nightPost)
                    return false;
                const hour = nightPost.createdAt.getHours();
                return hour >= 0 && hour < 4;
            case "LOGIN_STREAK":
                // TODO: Implement login streak tracking
                return false;
            case "SPECIAL":
                // Special badges are awarded manually
                return false;
            default:
                return false;
        }
    }
    /**
     * Award a badge to a user
     */
    static async awardBadge(userId, badgeId) {
        try {
            const badge = BADGES[badgeId.toUpperCase()];
            if (!badge) {
                throw new Error(`Badge ${badgeId} not found`);
            }
            // Check if already earned
            const existing = await db.userBadge.findUnique({
                where: {
                    userId_badgeId: {
                        userId,
                        badgeId: badge.id,
                    },
                },
            });
            if (existing) {
                logger.info({ userId, badgeId }, "Badge already earned");
                return;
            }
            // Get user details for email
            const user = await db.user.findUnique({
                where: { id: userId },
                select: { email: true, firstName: true },
            });
            // Award badge
            await db.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id,
                },
            });
            // Award points
            if (badge.points > 0) {
                await db.point.create({
                    data: {
                        userId,
                        amount: badge.points,
                        reason: `Earned badge: ${badge.name}`,
                        activity: "BADGE_EARNED",
                    },
                });
            }
            logger.info({ userId, badgeId, points: badge.points }, "Badge awarded successfully");
            // Send badge earned email
            if (user) {
                try {
                    await sendBadgeEarnedEmail(user.email, user.firstName, {
                        badgeName: badge.name,
                        badgeDescription: badge.description,
                        badgeTier: badge.tier,
                        pointsAwarded: badge.points,
                    });
                    logger.info({ userId, badgeId, email: user.email }, "Badge earned email sent");
                }
                catch (emailError) {
                    logger.error({ userId, badgeId, error: emailError.message }, "Failed to send badge earned email");
                    // Don't throw - badge is awarded, email failure shouldn't block the process
                }
            }
        }
        catch (error) {
            logger.error({ error, userId, badgeId }, "Failed to award badge");
            throw error;
        }
    }
    /**
     * Get user's earned badges
     */
    static async getUserBadges(userId) {
        try {
            const userBadges = await db.userBadge.findMany({
                where: { userId },
                orderBy: { earnedAt: "desc" },
            });
            return userBadges.map((ub) => {
                const badge = BADGES[ub.badgeId.toUpperCase()];
                return {
                    ...ub,
                    badge: badge || null,
                    awardedAt: ub.earnedAt, // Use earnedAt as awardedAt for API consistency
                };
            });
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get user badges");
            return [];
        }
    }
    /**
     * Get badge progress for user
     */
    static async getBadgeProgress(userId) {
        try {
            const stats = await this.getUserStats(userId);
            const userBadges = await db.userBadge.findMany({
                where: { userId },
                select: { badgeId: true },
            });
            const earnedBadgeIds = new Set(userBadges.map((b) => b.badgeId));
            const progress = [];
            for (const badge of ALL_BADGES) {
                const earned = earnedBadgeIds.has(badge.id);
                let currentValue = 0;
                // Get current progress value
                switch (badge.requirement.type) {
                    case "TOTAL_POINTS":
                        currentValue = stats.totalPoints;
                        break;
                    case "POSTS_CREATED":
                        currentValue = stats.postsCreated;
                        break;
                    case "LIKES_GIVEN":
                        currentValue = stats.likesGiven;
                        break;
                    case "COMMENTS_GIVEN":
                        currentValue = stats.commentsGiven;
                        break;
                    case "TEAMS_JOINED":
                        currentValue = stats.teamsJoined;
                        break;
                    case "POSTS_VIEWED":
                        currentValue = stats.postsViewed;
                        break;
                    case "POST_LIKES":
                        currentValue = stats.maxPostLikes;
                        break;
                    case "POST_COMMENTS":
                        currentValue = stats.maxPostComments;
                        break;
                    case "TEAM_MEMBERS":
                        currentValue = stats.teamMembersCount;
                        break;
                    case "DELIVERABLES_SUBMITTED":
                        currentValue = stats.deliverablesSubmitted;
                        break;
                    case "LEARNING_PATHS_COMPLETED":
                        currentValue = stats.learningPathsCompleted;
                        break;
                    case "PAYMENT_SUCCESS":
                        currentValue = stats.paymentsCompleted;
                        break;
                    default:
                        currentValue = earned ? badge.requirement.value : 0;
                }
                const percentage = Math.min(100, (currentValue / badge.requirement.value) * 100);
                progress.push({
                    badgeId: badge.id,
                    badge,
                    currentValue,
                    requiredValue: badge.requirement.value,
                    percentage: Math.round(percentage),
                    earned,
                });
            }
            // Sort: Unearned badges with high progress first, then earned badges
            return progress.sort((a, b) => {
                if (a.earned && !b.earned)
                    return 1;
                if (!a.earned && b.earned)
                    return -1;
                if (!a.earned && !b.earned)
                    return b.percentage - a.percentage;
                return b.badge.rarity - a.badge.rarity;
            });
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get badge progress");
            return [];
        }
    }
    /**
     * Get all available badges
     */
    static getAllBadges() {
        return ALL_BADGES;
    }
    /**
     * Get all badges from database (Admin)
     */
    static async getAllBadgesFromDB() {
        try {
            const badges = await db.badge.findMany({
                orderBy: [
                    { category: "asc" },
                    { tier: "asc" },
                ],
            });
            return badges;
        }
        catch (error) {
            logger.error({ error }, "Failed to get badges from database");
            throw error;
        }
    }
    /**
     * Get specific badge by badgeId (Admin)
     */
    static async getBadgeById(badgeId) {
        try {
            const badge = await db.badge.findUnique({
                where: { badgeId },
            });
            return badge;
        }
        catch (error) {
            logger.error({ error, badgeId }, "Failed to get badge by ID");
            throw error;
        }
    }
    /**
     * Get badge award count (Admin)
     */
    static async getBadgeAwardCount(badgeId) {
        try {
            const count = await db.userBadge.count({
                where: { badgeId },
            });
            return count;
        }
        catch (error) {
            logger.error({ error, badgeId }, "Failed to get badge award count");
            return 0;
        }
    }
    /**
     * Get badge leaderboard (users with most badges)
     */
    static async getBadgeLeaderboard(limit = 10) {
        try {
            const leaderboard = await db.userBadge.groupBy({
                by: ["userId"],
                _count: {
                    badgeId: true,
                },
                orderBy: {
                    _count: {
                        badgeId: "desc",
                    },
                },
                take: limit,
            });
            // Get user details
            const userIds = leaderboard.map((entry) => entry.userId);
            const users = await db.user.findMany({
                where: { id: { in: userIds } },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    profilePhoto: true,
                },
            });
            const userMap = new Map(users.map((u) => [u.id, u]));
            return leaderboard.map((entry) => ({
                user: userMap.get(entry.userId),
                badgeCount: entry._count.badgeId,
            }));
        }
        catch (error) {
            logger.error({ error }, "Failed to get badge leaderboard");
            return [];
        }
    }
    /**
     * Check and award badges for all users (for cron job)
     */
    static async checkBadgesForAllUsers() {
        try {
            logger.info("Starting badge check for all users");
            // Get all active users (adjust criteria as needed)
            const users = await db.user.findMany({
                where: {
                    isVerified: true, // Only check verified users
                },
                select: { id: true },
            });
            let totalBadgesAwarded = 0;
            // Check badges for each user
            for (const user of users) {
                try {
                    const newBadges = await this.checkAndAwardBadges(user.id);
                    totalBadgesAwarded += newBadges.length;
                    if (newBadges.length > 0) {
                        logger.info({ userId: user.id, badges: newBadges }, "New badges awarded to user");
                    }
                }
                catch (error) {
                    logger.error({ error, userId: user.id }, "Failed to check badges for user");
                    // Continue with next user even if one fails
                }
            }
            logger.info({ totalUsers: users.length, totalBadgesAwarded }, "Badge check completed for all users");
            return totalBadgesAwarded;
        }
        catch (error) {
            logger.error({ error }, "Failed to check badges for all users");
            return 0;
        }
    }
    /**
     * Process failed payment badge awards
     * Finds users with CONFIRMED payments who haven't received the "Paid Student" badge
     */
    static async processFailedPaymentBadges() {
        try {
            logger.info("🔄 Starting failed payment badge processing job");
            // Find users with confirmed payments who don't have the paid_student badge
            const confirmedPayments = await db.payment.findMany({
                where: {
                    status: PaymentStatus.CONFIRMED,
                    verifiedAt: {
                        not: null,
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (confirmedPayments.length === 0) {
                logger.info("No confirmed payments found, skipping badge processing");
                return;
            }
            // Get all users who already have the paid_student badge
            const usersWithBadge = await db.userBadge.findMany({
                where: {
                    badgeId: "paid_student",
                },
                select: {
                    userId: true,
                },
            });
            const usersWithBadgeSet = new Set(usersWithBadge.map((ub) => ub.userId));
            let processedCount = 0;
            let errorCount = 0;
            // Process each payment
            for (const payment of confirmedPayments) {
                if (!payment.user) {
                    logger.warn({ paymentId: payment.id }, "Payment has no user, skipping");
                    continue;
                }
                const userId = payment.user.id;
                // Skip if user already has the badge
                if (usersWithBadgeSet.has(userId)) {
                    continue;
                }
                try {
                    // Award the paid_student badge
                    await this.awardBadge(userId, "paid_student");
                    processedCount++;
                    logger.info({ userId, paymentId: payment.id }, "Awarded Paid Student badge to user");
                }
                catch (error) {
                    errorCount++;
                    logger.error({ userId, paymentId: payment.id, error: error.message }, "Failed to award Paid Student badge");
                }
            }
            logger.info({
                totalPayments: confirmedPayments.length,
                processedCount,
                errorCount,
            }, "Failed payment badge processing job completed");
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to process failed payment badges");
            throw error;
        }
    }
    /**
     * Revoke a badge from a user (Admin only)
     */
    static async revokeBadge(userId, badgeId) {
        try {
            const deleted = await db.userBadge.deleteMany({
                where: {
                    userId,
                    badgeId,
                },
            });
            if (deleted.count === 0) {
                throw new Error("Badge not found or already revoked");
            }
            logger.info({ userId, badgeId }, "Badge revoked successfully");
        }
        catch (error) {
            logger.error({ error, userId, badgeId }, "Failed to revoke badge");
            throw error;
        }
    }
    /**
     * Update badge information (Admin only)
     */
    static async updateBadge(badgeId, updates) {
        try {
            const updatedBadge = await db.badge.update({
                where: { badgeId },
                data: {
                    ...(updates.name && { name: updates.name }),
                    ...(updates.description && { description: updates.description }),
                    ...(updates.icon && { icon: updates.icon }),
                    ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
                    ...(updates.category && { category: updates.category }),
                    ...(updates.tier && { tier: updates.tier }),
                    ...(updates.points !== undefined && { points: updates.points }),
                    ...(updates.rarity !== undefined && { rarity: updates.rarity }),
                    ...(updates.criteria && { criteria: updates.criteria }),
                },
            });
            logger.info({ badgeId, updates }, "Badge updated successfully");
            return updatedBadge;
        }
        catch (error) {
            logger.error({ error, badgeId }, "Failed to update badge");
            throw error;
        }
    }
    /**
     * Get badge statistics (Admin only)
     */
    static async getBadgeStats() {
        try {
            const [totalBadges, totalAwarded, mostPopularBadges, recentlyAwarded, badgeDistribution,] = await Promise.all([
                // Total badges available
                db.badge.count(),
                // Total badges awarded
                db.userBadge.count(),
                // Most popular badges (top 10)
                db.userBadge.groupBy({
                    by: ["badgeId"],
                    _count: {
                        badgeId: true,
                    },
                    orderBy: {
                        _count: {
                            badgeId: "desc",
                        },
                    },
                    take: 10,
                }),
                // Recently awarded badges (last 10)
                db.userBadge.findMany({
                    take: 10,
                    orderBy: { earnedAt: "desc" },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                }),
                // Badge distribution by category
                db.badge.groupBy({
                    by: ["category"],
                    _count: {
                        category: true,
                    },
                }),
            ]);
            // Get badge details for popular badges
            const popularBadgeIds = mostPopularBadges.map((b) => b.badgeId);
            const popularBadgeDetails = await db.badge.findMany({
                where: { badgeId: { in: popularBadgeIds } },
            });
            const popularWithDetails = mostPopularBadges.map((stat) => {
                const badge = popularBadgeDetails.find((b) => b.badgeId === stat.badgeId);
                return {
                    badge,
                    awardedCount: stat._count.badgeId,
                };
            });
            return {
                totalBadges,
                totalAwarded,
                averageBadgesPerUser: totalAwarded / (await db.user.count()) || 0,
                mostPopular: popularWithDetails,
                recentlyAwarded: recentlyAwarded.map((ub) => ({
                    badgeId: ub.badgeId,
                    user: ub.user,
                    earnedAt: ub.earnedAt,
                })),
                distribution: badgeDistribution,
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get badge stats");
            throw error;
        }
    }
}
//# sourceMappingURL=service.js.map