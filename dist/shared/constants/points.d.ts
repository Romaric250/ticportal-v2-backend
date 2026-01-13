import { ActivityType } from "@prisma/client";
/**
 * TIC Points Configuration
 * Define point values for different activities
 */
export declare const POINTS_CONFIG: {
    readonly AUTH: {
        readonly REGISTER: 10;
        readonly EMAIL_VERIFICATION: 20;
        readonly LOGIN: 2;
        readonly PROFILE_COMPLETE: 30;
        readonly PROFILE_UPDATE: 5;
        readonly PASSWORD_RESET: 0;
    };
    readonly LEARNING: {
        readonly STAGE_START: 5;
        readonly STAGE_COMPLETE: 50;
        readonly QUIZ_ATTEMPT: 10;
        readonly QUIZ_PASS: 30;
        readonly QUIZ_PERFECT_SCORE: 50;
        readonly RESOURCE_VIEW: 2;
        readonly RESOURCE_COMPLETE: 10;
        readonly COURSE_COMPLETE: 100;
    };
    readonly HACKATHON: {
        readonly REGISTER: 20;
        readonly TEAM_CREATE: 15;
        readonly SUBMISSION: 100;
        readonly SUBMISSION_UPDATE: 10;
        readonly SUBMISSION_ON_TIME: 20;
        readonly DELIVERABLE_SUBMIT: 10;
        readonly DELIVERABLE_APPROVED: 20;
        readonly WIN_FIRST: 500;
        readonly WIN_SECOND: 300;
        readonly WIN_THIRD: 200;
        readonly PARTICIPATION: 50;
    };
    readonly MENTORSHIP: {
        readonly REQUEST_MENTOR: 5;
        readonly SESSION_ATTEND: 25;
        readonly SESSION_COMPLETE: 40;
        readonly PROVIDE_SESSION: 50;
        readonly FEEDBACK_PROVIDE: 10;
    };
    readonly COLLABORATION: {
        readonly TEAM_CREATE: 15;
        readonly TEAM_JOIN: 10;
        readonly TEAM_CREATED: 15;
        readonly TEAM_JOINED: 10;
        readonly TEAM_UPDATED: 5;
        readonly TEAM_DELETED: 0;
        readonly TEAM_MEMBER_ADDED: 5;
        readonly TEAM_MEMBER_REMOVED: 0;
        readonly TEAM_MEMBER_ROLE_UPDATED: 3;
        readonly TEAM_LEFT: 0;
        readonly REMOVED_FROM_TEAM: 0;
        readonly TEAM_MESSAGE_SENT: 1;
        readonly SQUAD_JOIN: 15;
        readonly MESSAGE_SEND: 1;
        readonly FILE_SHARE: 5;
        readonly TEAM_ACTIVITY: 5;
    };
    readonly GAMIFICATION: {
        readonly BADGE_EARNED: 50;
        readonly STREAK_2_DAYS: 10;
        readonly STREAK_3_DAYS: 20;
        readonly STREAK_7_DAYS: 50;
        readonly STREAK_30_DAYS: 200;
        readonly LEADERBOARD_TOP_10: 100;
        readonly LEADERBOARD_TOP_3: 300;
    };
};
/**
 * Activity cooldown periods (in milliseconds)
 * Prevent point farming by limiting how often certain activities can earn points
 */
export declare const ACTIVITY_COOLDOWN: {
    readonly DAILY_LOGIN: number;
    readonly MESSAGE_SENT: number;
};
/**
 * Maximum points per activity type per day
 */
export declare const DAILY_LIMITS: {
    readonly MESSAGE_SENT: 10;
    readonly DAILY_LOGIN: 2;
};
/**
 * Map actions to their activity types
 */
export declare const ACTIVITY_TYPE_MAP: Record<string, ActivityType>;
/**
 * Activities that should only award points once (prevent duplicates)
 */
export declare const UNIQUE_ACTIVITIES: string[];
/**
 * Helper to get points for an activity
 */
export declare function getActivityPoints(category: keyof typeof POINTS_CONFIG, action: string): number;
//# sourceMappingURL=points.d.ts.map