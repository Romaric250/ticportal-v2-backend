import { BadgeCategory, BadgeTier, type Badge } from "./types";
/**
 * All available badges in the system
 */
export declare const BADGES: Record<string, Badge>;
export declare const ALL_BADGES: Badge[];
export declare const getBadgesByCategory: (category: BadgeCategory) => Badge[];
export declare const getBadgesByTier: (tier: BadgeTier) => Badge[];
//# sourceMappingURL=badges.d.ts.map