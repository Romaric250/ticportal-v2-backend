import type { Request, Response } from "express";
export declare class BadgeController {
    /**
     * GET /api/badges/my-badges
     * Get current user's earned badges
     */
    static getMyBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/badges/progress
     * Get badge progress for current user
     */
    static getBadgeProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/badges/all
     * Get all available badges
     */
    static getAllBadges(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/badges/leaderboard
     * Get badge leaderboard
     */
    static getLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/badges/check
     * Manually trigger badge check for current user
     */
    static checkBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/badges/user/:userId
     * Get badges for specific user (public)
     */
    static getUserBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/badges/admin/award
     * Manually award badge to user (Admin only)
     */
    static adminAwardBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/badges/admin/revoke
     * Revoke badge from user (Admin only)
     */
    static adminRevokeBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/badges/admin/:badgeId
     * Update badge information (Admin only)
     */
    static adminUpdateBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/badges/admin/stats
     * Get badge statistics (Admin only)
     */
    static adminGetBadgeStats(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/badges/admin/sync-all
     * Sync badges for all users (Admin only)
     */
    static adminSyncAllBadges(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/badges/admin/user-badges/:userId
     * Get detailed badge info for specific user (Admin only)
     */
    static adminGetUserBadges(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/badges/admin/all
     * Get all badges with full database details (Admin only)
     */
    static adminGetAllBadges(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/badges/admin/badge/:badgeId
     * Get specific badge details (Admin only)
     */
    static adminGetBadge(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map