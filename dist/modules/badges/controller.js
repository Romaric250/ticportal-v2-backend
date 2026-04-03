import { BadgeService } from "./service.js";
import { logger } from "../../shared/utils/logger.js";
export class BadgeController {
    /**
     * GET /api/badges/my-badges
     * Get current user's earned badges
     */
    static async getMyBadges(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const badges = await BadgeService.getUserBadges(userId);
            res.json({
                success: true,
                data: {
                    badges,
                    total: badges.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get user badges");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badges",
            });
        }
    }
    /**
     * GET /api/badges/progress
     * Get badge progress for current user
     */
    static async getBadgeProgress(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const progress = await BadgeService.getBadgeProgress(userId);
            res.json({
                success: true,
                data: {
                    progress,
                    earnedCount: progress.filter((p) => p.earned).length,
                    totalCount: progress.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get badge progress");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badge progress",
            });
        }
    }
    /**
     * GET /api/badges/all
     * Get all available badges
     */
    static async getAllBadges(req, res) {
        try {
            const badges = BadgeService.getAllBadges();
            res.json({
                success: true,
                data: {
                    badges,
                    total: badges.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get all badges");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badges",
            });
        }
    }
    /**
     * GET /api/badges/leaderboard
     * Get badge leaderboard
     */
    static async getLeaderboard(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const leaderboard = await BadgeService.getBadgeLeaderboard(limit);
            res.json({
                success: true,
                data: leaderboard,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get badge leaderboard");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get leaderboard",
            });
        }
    }
    /**
     * POST /api/badges/check
     * Manually trigger badge check for current user
     */
    static async checkBadges(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const newBadges = await BadgeService.checkAndAwardBadges(userId);
            res.json({
                success: true,
                data: {
                    newBadges,
                    count: newBadges.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to check badges");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to check badges",
            });
        }
    }
    /**
     * GET /api/badges/user/:userId
     * Get badges for specific user (public)
     */
    static async getUserBadges(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const badges = await BadgeService.getUserBadges(userId);
            res.json({
                success: true,
                data: {
                    badges,
                    total: badges.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message, userId: req.params.userId }, "Failed to get user badges");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badges",
            });
        }
    }
    // ==================== ADMIN ROUTES ====================
    /**
     * POST /api/badges/admin/award
     * Manually award badge to user (Admin only)
     */
    static async adminAwardBadge(req, res) {
        try {
            const { userId, badgeId } = req.body;
            if (!userId || !badgeId) {
                return res.status(400).json({
                    success: false,
                    message: "userId and badgeId are required",
                });
            }
            await BadgeService.awardBadge(userId, badgeId);
            res.json({
                success: true,
                message: "Badge awarded successfully",
                data: {
                    userId,
                    badgeId,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to award badge");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to award badge",
            });
        }
    }
    /**
     * DELETE /api/badges/admin/revoke
     * Revoke badge from user (Admin only)
     */
    static async adminRevokeBadge(req, res) {
        try {
            const { userId, badgeId } = req.body;
            if (!userId || !badgeId) {
                return res.status(400).json({
                    success: false,
                    message: "userId and badgeId are required",
                });
            }
            await BadgeService.revokeBadge(userId, badgeId);
            res.json({
                success: true,
                message: "Badge revoked successfully",
                data: {
                    userId,
                    badgeId,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to revoke badge");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to revoke badge",
            });
        }
    }
    /**
     * PUT /api/badges/admin/:badgeId
     * Update badge information (Admin only)
     */
    static async adminUpdateBadge(req, res) {
        try {
            const { badgeId } = req.params;
            const updates = req.body;
            if (!badgeId) {
                return res.status(400).json({
                    success: false,
                    message: "badgeId is required",
                });
            }
            const updatedBadge = await BadgeService.updateBadge(badgeId, updates);
            res.json({
                success: true,
                message: "Badge updated successfully",
                data: updatedBadge,
            });
        }
        catch (error) {
            logger.error({ error: error.message, badgeId: req.params.badgeId }, "Failed to update badge");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update badge",
            });
        }
    }
    /**
     * GET /api/badges/admin/stats
     * Get badge statistics (Admin only)
     */
    static async adminGetBadgeStats(req, res) {
        try {
            const stats = await BadgeService.getBadgeStats();
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get badge stats");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badge stats",
            });
        }
    }
    /**
     * POST /api/badges/admin/sync-all
     * Sync badges for all users (Admin only)
     */
    static async adminSyncAllBadges(req, res) {
        try {
            logger.info("Admin triggered badge sync for all users");
            const totalAwarded = await BadgeService.checkBadgesForAllUsers();
            res.json({
                success: true,
                message: "Badge sync completed",
                data: {
                    totalBadgesAwarded: totalAwarded,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to sync badges");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to sync badges",
            });
        }
    }
    /**
     * GET /api/badges/admin/user-badges/:userId
     * Get detailed badge info for specific user (Admin only)
     */
    static async adminGetUserBadges(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "userId is required",
                });
            }
            const badges = await BadgeService.getUserBadges(userId);
            const progress = await BadgeService.getBadgeProgress(userId);
            res.json({
                success: true,
                data: {
                    badges,
                    progress,
                    earnedCount: badges.length,
                    totalCount: progress.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message, userId: req.params.userId }, "Failed to get user badge details");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get user badge details",
            });
        }
    }
    /**
     * GET /api/badges/admin/all
     * Get all badges with full database details (Admin only)
     */
    static async adminGetAllBadges(req, res) {
        try {
            const badges = await BadgeService.getAllBadgesFromDB();
            res.json({
                success: true,
                data: {
                    badges,
                    total: badges.length,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get all badges from DB");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badges",
            });
        }
    }
    /**
     * GET /api/badges/admin/badge/:badgeId
     * Get specific badge details (Admin only)
     */
    static async adminGetBadge(req, res) {
        try {
            const { badgeId } = req.params;
            if (!badgeId) {
                return res.status(400).json({
                    success: false,
                    message: "badgeId is required",
                });
            }
            const badge = await BadgeService.getBadgeById(badgeId);
            if (!badge) {
                return res.status(404).json({
                    success: false,
                    message: "Badge not found",
                });
            }
            // Get award count
            const awardCount = await BadgeService.getBadgeAwardCount(badgeId);
            res.json({
                success: true,
                data: {
                    badge,
                    awardCount,
                },
            });
        }
        catch (error) {
            logger.error({ error: error.message, badgeId: req.params.badgeId }, "Failed to get badge details");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get badge",
            });
        }
    }
}
//# sourceMappingURL=controller.js.map