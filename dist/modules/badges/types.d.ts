/**
 * Badge System Types
 */
export declare enum BadgeCategory {
    POINTS = "POINTS",
    SOCIAL = "SOCIAL",
    CONTENT = "CONTENT",
    TEAM = "TEAM",
    ACHIEVEMENT = "ACHIEVEMENT",
    SPECIAL = "SPECIAL"
}
export declare enum BadgeTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND"
}
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: BadgeCategory;
    tier: BadgeTier;
    points: number;
    requirement: {
        type: string;
        value: number;
        description: string;
    };
    rarity: number;
}
export interface UserBadge {
    badgeId: string;
    userId: string;
    awardedAt: Date;
    progress?: number;
    badge: Badge;
}
export interface BadgeProgress {
    badgeId: string;
    badge: Badge;
    currentValue: number;
    requiredValue: number;
    percentage: number;
    earned: boolean;
}
//# sourceMappingURL=types.d.ts.map