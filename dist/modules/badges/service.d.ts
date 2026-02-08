import type { Badge, BadgeProgress } from "./types";
export declare class BadgeService {
    /**
     * Check and award badges to user based on their activity
     */
    static checkAndAwardBadges(userId: string): Promise<string[]>;
    /**
     * Get user statistics for badge checking
     */
    private static getUserStats;
    /**
     * Check if badge requirement is met
     */
    private static checkBadgeRequirement;
    /**
     * Award a badge to a user
     */
    static awardBadge(userId: string, badgeId: string): Promise<void>;
    /**
     * Get user's earned badges
     */
    static getUserBadges(userId: string): Promise<{
        badge: Badge | null;
        awardedAt: Date;
        userId: string;
        id: string;
        earnedAt: Date;
        badgeId: string;
    }[]>;
    /**
     * Get badge progress for user
     */
    static getBadgeProgress(userId: string): Promise<BadgeProgress[]>;
    /**
     * Get all available badges
     */
    static getAllBadges(): Badge[];
    /**
     * Get all badges from database (Admin)
     */
    static getAllBadgesFromDB(): Promise<{
        id: string;
        name: string;
        points: number;
        description: string;
        tier: string;
        badgeId: string;
        category: string;
        icon: string;
        imageUrl: string | null;
        rarity: number;
        criteria: string | null;
    }[]>;
    /**
     * Get specific badge by badgeId (Admin)
     */
    static getBadgeById(badgeId: string): Promise<{
        id: string;
        name: string;
        points: number;
        description: string;
        tier: string;
        badgeId: string;
        category: string;
        icon: string;
        imageUrl: string | null;
        rarity: number;
        criteria: string | null;
    } | null>;
    /**
     * Get badge award count (Admin)
     */
    static getBadgeAwardCount(badgeId: string): Promise<number>;
    /**
     * Get badge leaderboard (users with most badges)
     */
    static getBadgeLeaderboard(limit?: number): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
        } | undefined;
        badgeCount: number;
    }[]>;
    /**
     * Check and award badges for all users (for cron job)
     */
    static checkBadgesForAllUsers(): Promise<number>;
    /**
     * Revoke a badge from a user (Admin only)
     */
    static revokeBadge(userId: string, badgeId: string): Promise<void>;
    /**
     * Update badge information (Admin only)
     */
    static updateBadge(badgeId: string, updates: any): Promise<any>;
    /**
     * Get badge statistics (Admin only)
     */
    static getBadgeStats(): Promise<any>;
}
//# sourceMappingURL=service.d.ts.map