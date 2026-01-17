import type { DashboardOverview } from "./types";
export declare class DashboardService {
    /**
     * Get complete dashboard overview for user
     */
    static getDashboardOverview(userId: string): Promise<DashboardOverview>;
    /**
     * Get user basic info
     */
    private static getUserInfo;
    /**
     * Get user stats (TP, level, streak)
     */
    private static getUserStats;
    /**
     * Calculate user level from points
     */
    private static calculateLevel;
    /**
     * Calculate day streak
     */
    private static calculateStreak;
    /**
     * Get next learning module to continue
     */
    private static getNextModule;
    /**
     * Get user's team
     */
    private static getUserTeam;
    /**
     * Get upcoming deadlines
     */
    private static getUpcomingDeadlines;
    /**
     * Get recent badges
     */
    private static getRecentBadges;
    /**
     * Get badge stats
     */
    private static getBadgeStats;
    /**
     * Generate initials safely
     */
    private static generateInitials;
    /**
     * Get badge color from tier
     */
    private static getBadgeColor;
}
//# sourceMappingURL=service.d.ts.map