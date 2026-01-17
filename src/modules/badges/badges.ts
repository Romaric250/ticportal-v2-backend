import { BadgeCategory, BadgeTier, type Badge } from "./types";

/**
 * All available badges in the system
 */
export const BADGES: Record<string, Badge> = {
  // ==================== POINTS BADGES ====================
  ROOKIE: {
    id: "rookie",
    name: "Rookie",
    description: "Earn your first 100 TIC Points",
    icon: "🌱",
    category: BadgeCategory.POINTS,
    tier: BadgeTier.BRONZE,
    points: 50,
    requirement: {
      type: "TOTAL_POINTS",
      value: 100,
      description: "Reach 100 total points",
    },
    rarity: 95, // 95% of users get this
  },

  RISING_STAR: {
    id: "rising_star",
    name: "Rising Star",
    description: "Earn 500 TIC Points",
    icon: "⭐",
    category: BadgeCategory.POINTS,
    tier: BadgeTier.SILVER,
    points: 100,
    requirement: {
      type: "TOTAL_POINTS",
      value: 500,
      description: "Reach 500 total points",
    },
    rarity: 70,
  },

  POINT_MASTER: {
    id: "point_master",
    name: "Point Master",
    description: "Earn 1,000 TIC Points",
    icon: "🏆",
    category: BadgeCategory.POINTS,
    tier: BadgeTier.GOLD,
    points: 200,
    requirement: {
      type: "TOTAL_POINTS",
      value: 1000,
      description: "Reach 1,000 total points",
    },
    rarity: 40,
  },

  LEGEND: {
    id: "legend",
    name: "Legend",
    description: "Earn 5,000 TIC Points",
    icon: "💎",
    category: BadgeCategory.POINTS,
    tier: BadgeTier.DIAMOND,
    points: 500,
    requirement: {
      type: "TOTAL_POINTS",
      value: 5000,
      description: "Reach 5,000 total points",
    },
    rarity: 10,
  },

  // ==================== CONTENT BADGES ====================
  FIRST_POST: {
    id: "first_post",
    name: "First Post",
    description: "Create your first feed post",
    icon: "📝",
    category: BadgeCategory.CONTENT,
    tier: BadgeTier.BRONZE,
    points: 25,
    requirement: {
      type: "POSTS_CREATED",
      value: 1,
      description: "Create 1 post",
    },
    rarity: 90,
  },

  CONTENT_CREATOR: {
    id: "content_creator",
    name: "Content Creator",
    description: "Create 10 feed posts",
    icon: "✍️",
    category: BadgeCategory.CONTENT,
    tier: BadgeTier.SILVER,
    points: 100,
    requirement: {
      type: "POSTS_CREATED",
      value: 10,
      description: "Create 10 posts",
    },
    rarity: 50,
  },

  PROLIFIC_WRITER: {
    id: "prolific_writer",
    name: "Prolific Writer",
    description: "Create 50 feed posts",
    icon: "📚",
    category: BadgeCategory.CONTENT,
    tier: BadgeTier.GOLD,
    points: 300,
    requirement: {
      type: "POSTS_CREATED",
      value: 50,
      description: "Create 50 posts",
    },
    rarity: 20,
  },

  VIRAL_SENSATION: {
    id: "viral_sensation",
    name: "Viral Sensation",
    description: "Get 100 likes on a single post",
    icon: "🔥",
    category: BadgeCategory.CONTENT,
    tier: BadgeTier.GOLD,
    points: 250,
    requirement: {
      type: "POST_LIKES",
      value: 100,
      description: "Get 100 likes on one post",
    },
    rarity: 15,
  },

  ENGAGEMENT_KING: {
    id: "engagement_king",
    name: "Engagement King",
    description: "Get 50 comments on a single post",
    icon: "👑",
    category: BadgeCategory.CONTENT,
    tier: BadgeTier.PLATINUM,
    points: 300,
    requirement: {
      type: "POST_COMMENTS",
      value: 50,
      description: "Get 50 comments on one post",
    },
    rarity: 12,
  },

  // ==================== SOCIAL BADGES ====================
  FRIENDLY: {
    id: "friendly",
    name: "Friendly",
    description: "Like 50 posts",
    icon: "❤️",
    category: BadgeCategory.SOCIAL,
    tier: BadgeTier.BRONZE,
    points: 50,
    requirement: {
      type: "LIKES_GIVEN",
      value: 50,
      description: "Like 50 posts",
    },
    rarity: 60,
  },

  COMMENTATOR: {
    id: "commentator",
    name: "Commentator",
    description: "Leave 25 comments",
    icon: "💬",
    category: BadgeCategory.SOCIAL,
    tier: BadgeTier.SILVER,
    points: 100,
    requirement: {
      type: "COMMENTS_GIVEN",
      value: 25,
      description: "Comment 25 times",
    },
    rarity: 50,
  },

  CONVERSATION_STARTER: {
    id: "conversation_starter",
    name: "Conversation Starter",
    description: "Leave 100 comments",
    icon: "🗣️",
    category: BadgeCategory.SOCIAL,
    tier: BadgeTier.GOLD,
    points: 200,
    requirement: {
      type: "COMMENTS_GIVEN",
      value: 100,
      description: "Comment 100 times",
    },
    rarity: 25,
  },

  // ==================== TEAM BADGES ====================
  TEAM_PLAYER: {
    id: "team_player",
    name: "Team Player",
    description: "Join your first team",
    icon: "🤝",
    category: BadgeCategory.TEAM,
    tier: BadgeTier.BRONZE,
    points: 50,
    requirement: {
      type: "TEAMS_JOINED",
      value: 1,
      description: "Join 1 team",
    },
    rarity: 85,
  },

  TEAM_LEADER: {
    id: "team_leader",
    name: "Team Leader",
    description: "Create a team with 5+ members",
    icon: "👥",
    category: BadgeCategory.TEAM,
    tier: BadgeTier.SILVER,
    points: 150,
    requirement: {
      type: "TEAM_MEMBERS",
      value: 5,
      description: "Have 5+ members in your team",
    },
    rarity: 30,
  },

  SQUAD_COMMANDER: {
    id: "squad_commander",
    name: "Squad Commander",
    description: "Lead a team with 10+ members",
    icon: "⚔️",
    category: BadgeCategory.TEAM,
    tier: BadgeTier.GOLD,
    points: 300,
    requirement: {
      type: "TEAM_MEMBERS",
      value: 10,
      description: "Have 10+ members in your team",
    },
    rarity: 15,
  },

  DELIVERABLE_PRO: {
    id: "deliverable_pro",
    name: "Deliverable Pro",
    description: "Submit 3+ deliverables",
    icon: "📦",
    category: BadgeCategory.TEAM,
    tier: BadgeTier.GOLD,
    points: 200,
    requirement: {
      type: "DELIVERABLES_SUBMITTED",
      value: 3,
      description: "Submit 3 deliverables",
    },
    rarity: 35,
  },

  // ==================== LEARNING PATH BADGES ====================
  LEARNING_STARTER: {
    id: "learning_starter",
    name: "Learning Starter",
    description: "Complete your first learning path",
    icon: "🎓",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.BRONZE,
    points: 100,
    requirement: {
      type: "LEARNING_PATHS_COMPLETED",
      value: 1,
      description: "Complete 1 learning path",
    },
    rarity: 70,
  },

  KNOWLEDGE_SEEKER: {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 3 learning paths",
    icon: "📖",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.SILVER,
    points: 250,
    requirement: {
      type: "LEARNING_PATHS_COMPLETED",
      value: 3,
      description: "Complete 3 learning paths",
    },
    rarity: 40,
  },

  MASTER_LEARNER: {
    id: "master_learner",
    name: "Master Learner",
    description: "Complete 5 learning paths",
    icon: "🏆",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.GOLD,
    points: 500,
    requirement: {
      type: "LEARNING_PATHS_COMPLETED",
      value: 5,
      description: "Complete 5 learning paths",
    },
    rarity: 20,
  },

  SCHOLAR: {
    id: "scholar",
    name: "Scholar",
    description: "Complete 10 learning paths",
    icon: "👨‍🎓",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.PLATINUM,
    points: 1000,
    requirement: {
      type: "LEARNING_PATHS_COMPLETED",
      value: 10,
      description: "Complete 10 learning paths",
    },
    rarity: 10,
  },

  // ==================== ACHIEVEMENT BADGES ====================
  EARLY_BIRD: {
    id: "early_bird",
    name: "Early Bird",
    description: "Post within the first hour of joining",
    icon: "🐦",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.BRONZE,
    points: 50,
    requirement: {
      type: "EARLY_POST",
      value: 1,
      description: "Post within 1 hour of registration",
    },
    rarity: 45,
  },

  DAILY_ACTIVE: {
    id: "daily_active",
    name: "Daily Active",
    description: "Be active for 7 days in a row",
    icon: "📅",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.SILVER,
    points: 150,
    requirement: {
      type: "LOGIN_STREAK",
      value: 7,
      description: "7-day login streak",
    },
    rarity: 40,
  },

  DEDICATED: {
    id: "dedicated",
    name: "Dedicated",
    description: "Be active for 30 days in a row",
    icon: "🔥",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.GOLD,
    points: 500,
    requirement: {
      type: "LOGIN_STREAK",
      value: 30,
      description: "30-day login streak",
    },
    rarity: 10,
  },

  NIGHT_OWL: {
    id: "night_owl",
    name: "Night Owl",
    description: "Post between midnight and 4 AM",
    icon: "🦉",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.BRONZE,
    points: 25,
    requirement: {
      type: "NIGHT_POST",
      value: 1,
      description: "Post between 12 AM - 4 AM",
    },
    rarity: 55,
  },

  SPEED_READER: {
    id: "speed_reader",
    name: "Speed Reader",
    description: "View 100 posts",
    icon: "📖",
    category: BadgeCategory.ACHIEVEMENT,
    tier: BadgeTier.SILVER,
    points: 100,
    requirement: {
      type: "POSTS_VIEWED",
      value: 100,
      description: "View 100 posts",
    },
    rarity: 45,
  },

  // ==================== SPECIAL BADGES ====================
  FOUNDING_MEMBER: {
    id: "founding_member",
    name: "Founding Member",
    description: "Joined during TIC Portal launch",
    icon: "🌟",
    category: BadgeCategory.SPECIAL,
    tier: BadgeTier.PLATINUM,
    points: 1000,
    requirement: {
      type: "SPECIAL",
      value: 1,
      description: "Registered in launch month",
    },
    rarity: 5,
  },

  HACKATHON_WINNER: {
    id: "hackathon_winner",
    name: "Hackathon Winner",
    description: "Win a TIC hackathon",
    icon: "🏅",
    category: BadgeCategory.SPECIAL,
    tier: BadgeTier.DIAMOND,
    points: 2000,
    requirement: {
      type: "SPECIAL",
      value: 1,
      description: "Win a hackathon",
    },
    rarity: 2,
  },

  BUG_HUNTER: {
    id: "bug_hunter",
    name: "Bug Hunter",
    description: "Report a critical bug",
    icon: "🐛",
    category: BadgeCategory.SPECIAL,
    tier: BadgeTier.GOLD,
    points: 500,
    requirement: {
      type: "SPECIAL",
      value: 1,
      description: "Report verified bug",
    },
    rarity: 8,
  },
};

// Helper to get all badges as array
export const ALL_BADGES = Object.values(BADGES);

// Get badges by category
export const getBadgesByCategory = (category: BadgeCategory) => {
  return ALL_BADGES.filter((badge) => badge.category === category);
};

// Get badges by tier
export const getBadgesByTier = (tier: BadgeTier) => {
  return ALL_BADGES.filter((badge) => badge.tier === tier);
};
