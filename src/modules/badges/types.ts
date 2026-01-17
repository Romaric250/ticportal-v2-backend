/**
 * Badge System Types
 */

export enum BadgeCategory {
  POINTS = "POINTS",
  SOCIAL = "SOCIAL",
  CONTENT = "CONTENT",
  TEAM = "TEAM",
  ACHIEVEMENT = "ACHIEVEMENT",
  SPECIAL = "SPECIAL",
}

export enum BadgeTier {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM",
  DIAMOND = "DIAMOND",
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  category: BadgeCategory;
  tier: BadgeTier;
  points: number; // Points awarded when earning badge
  requirement: {
    type: string;
    value: number;
    description: string;
  };
  rarity: number; // 1-100 (how rare is this badge)
}

export interface UserBadge {
  badgeId: string;
  userId: string;
  awardedAt: Date;
  progress?: number; // For progressive badges
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
