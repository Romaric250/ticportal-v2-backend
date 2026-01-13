import type { ActivityType } from "@prisma/client";
interface AwardPointsParams {
    userId: string;
    activityType: ActivityType;
    action: string;
    points: number;
    reason: string;
    metadata?: Record<string, any>;
}
export declare class PointsService {
    /**
     * Award points to a user for completing an activity
     */
    static awardPoints(params: AwardPointsParams): Promise<boolean>;
    /**
     * Check if user can perform action based on cooldown
     */
    private static checkCooldown;
    /**
     * Get total points awarded today for a specific action
     */
    private static getTodayPoints;
    /**
     * Get total points for a user
     */
    static getUserTotalPoints(userId: string): Promise<number>;
    /**
     * Get user's point history
     */
    static getUserPointHistory(userId: string, limit?: number): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        amount: number;
        reason: string;
        activity: string | null;
    }[]>;
    /**
     * Get user's activity history
     */
    static getUserActivityHistory(userId: string, activityType?: ActivityType, limit?: number): Promise<{
        userId: string;
        action: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: import(".prisma/client").$Enums.ActivityType;
        pointsAwarded: number;
        createdAt: Date;
    }[]>;
    /**
     * Award points for daily login
     */
    static awardDailyLogin(userId: string): Promise<boolean>;
    /**
     * Award points for email verification
     */
    static awardEmailVerification(userId: string): Promise<boolean>;
    /**
     * Award points for completing a stage
     */
    static awardStageCompletion(userId: string, stageId: string, stageName: string): Promise<boolean>;
    /**
     * Award points for passing a quiz
     */
    static awardQuizCompletion(userId: string, quizId: string, score: number, maxScore: number): Promise<boolean>;
    /**
     * Award points for earning a badge
     */
    static awardBadgeEarned(userId: string, badgeId: string, badgeName: string): Promise<boolean>;
    /**
     * Award points for hackathon submission
     */
    static awardHackathonSubmission(userId: string, hackathonId: string, isOnTime: boolean): Promise<boolean>;
}
export {};
//# sourceMappingURL=points.service.d.ts.map