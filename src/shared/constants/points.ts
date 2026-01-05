import { ActivityType } from "@prisma/client";

/**
 * TIC Points Configuration
 * Define point values for different activities
 */

export const POINTS_CONFIG = {
  // Authentication & Profile
  AUTH: {
    REGISTER: 10,
    EMAIL_VERIFICATION: 20,
    LOGIN: 2,
    PROFILE_COMPLETE: 30,
    PROFILE_UPDATE: 5,
    PASSWORD_RESET: 0, // No points for security actions
  },

  // Learning Activities
  LEARNING: {
    STAGE_START: 5,
    STAGE_COMPLETE: 50,
    QUIZ_ATTEMPT: 10,
    QUIZ_PASS: 30,
    QUIZ_PERFECT_SCORE: 50,
    RESOURCE_VIEW: 2,
    RESOURCE_COMPLETE: 10,
    COURSE_COMPLETE: 100,
  },

  // Hackathons
  HACKATHON: {
    REGISTER: 20,
    TEAM_CREATE: 15,
    SUBMISSION: 100,
    SUBMISSION_UPDATE: 10,
    SUBMISSION_ON_TIME: 20,
    WIN_FIRST: 500,
    WIN_SECOND: 300,
    WIN_THIRD: 200,
    PARTICIPATION: 50,
  },

  // Mentorship
  MENTORSHIP: {
    REQUEST_MENTOR: 5,
    SESSION_ATTEND: 25,
    SESSION_COMPLETE: 40,
    PROVIDE_SESSION: 50,
    FEEDBACK_PROVIDE: 10,
  },

  // Collaboration
  COLLABORATION: {
    TEAM_CREATE: 15,
    TEAM_JOIN: 10,
    TEAM_CREATED: 15,
    TEAM_JOINED: 10,
    TEAM_UPDATED: 5,
    TEAM_DELETED: 0,
    TEAM_MEMBER_ADDED: 5,
    TEAM_MEMBER_REMOVED: 0,
    TEAM_MEMBER_ROLE_UPDATED: 3,
    TEAM_LEFT: 0,
    REMOVED_FROM_TEAM: 0,
    TEAM_MESSAGE_SENT: 1,
    SQUAD_JOIN: 15,
    MESSAGE_SEND: 1,
    FILE_SHARE: 5,
    TEAM_ACTIVITY: 5,
  },

  // Gamification
  GAMIFICATION: {
    BADGE_EARNED: 50,
    STREAK_2_DAYS: 10,
    STREAK_3_DAYS: 20,
    STREAK_7_DAYS: 50,
    STREAK_30_DAYS: 200,
    LEADERBOARD_TOP_10: 100,
    LEADERBOARD_TOP_3: 300,
  },
} as const;

/**
 * Activity cooldown periods (in milliseconds)
 * Prevent point farming by limiting how often certain activities can earn points
 */
export const ACTIVITY_COOLDOWN = {
  DAILY_LOGIN: 24 * 60 * 60 * 1000, // 24 hours
  MESSAGE_SENT: 60 * 1000, // 1 minute
} as const;

/**
 * Maximum points per activity type per day
 */
export const DAILY_LIMITS = {
  MESSAGE_SENT: 10, // Max 10 points per day from messages
  DAILY_LOGIN: 2, // Max 2 points per day from login
} as const;

/**
 * Map actions to their activity types
 */
export const ACTIVITY_TYPE_MAP: Record<string, ActivityType> = {
  // Auth
  REGISTER: "AUTH",
  EMAIL_VERIFICATION: "AUTH",
  LOGIN: "AUTH",
  LOGOUT: "AUTH",
  PROFILE_COMPLETE: "AUTH",
  PROFILE_UPDATE: "AUTH",

  // Learning
  STAGE_START: "LEARNING",
  STAGE_COMPLETE: "LEARNING",
  QUIZ_ATTEMPT: "LEARNING",
  QUIZ_PASS: "LEARNING",
  RESOURCE_VIEW: "LEARNING",
  RESOURCE_COMPLETE: "LEARNING",

  // Hackathon
  HACKATHON_REGISTER: "HACKATHON",
  SUBMISSION: "HACKATHON",
  SUBMISSION_UPDATE: "HACKATHON",

  // Mentorship
  REQUEST_MENTOR: "MENTORSHIP",
  SESSION_ATTEND: "MENTORSHIP",
  SESSION_COMPLETE: "MENTORSHIP",

  // Collaboration
  TEAM_CREATE: "COLLABORATION",
  TEAM_JOIN: "COLLABORATION",
  TEAM_CREATED: "COLLABORATION",
  TEAM_JOINED: "COLLABORATION",
  TEAM_UPDATED: "COLLABORATION",
  TEAM_DELETED: "COLLABORATION",
  TEAM_MEMBER_ADDED: "COLLABORATION",
  TEAM_MEMBER_REMOVED: "COLLABORATION",
  TEAM_MEMBER_ROLE_UPDATED: "COLLABORATION",
  TEAM_LEFT: "COLLABORATION",
  REMOVED_FROM_TEAM: "COLLABORATION",
  MESSAGE_SEND: "COLLABORATION",

  // Gamification
  BADGE_EARN: "GAMIFICATION",
  LEADERBOARD_RANK: "GAMIFICATION",
};

/**
 * Activities that should only award points once (prevent duplicates)
 */
export const UNIQUE_ACTIVITIES = [
  "REGISTER",
  "EMAIL_VERIFICATION",
  "PROFILE_COMPLETE",
  "STAGE_COMPLETE",
  "QUIZ_PASS",
  "TEAM_JOIN",
  "TEAM_JOINED",
  "SQUAD_JOIN",
  "BADGE_EARN",
];

/**
 * Helper to get points for an activity
 */
export function getActivityPoints(
  category: keyof typeof POINTS_CONFIG,
  action: string,
): number {
  const categoryPoints = POINTS_CONFIG[category];
  if (!categoryPoints) return 0;

  const points = (categoryPoints as Record<string, number>)[action];
  return points || 0;
}
