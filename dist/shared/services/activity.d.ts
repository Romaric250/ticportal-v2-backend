import { ActivityType } from "@prisma/client";
interface TrackActivityOptions {
    userId: string;
    action: string;
    metadata?: Record<string, unknown>;
    awardPoints?: boolean;
}
declare class ActivityService {
    /**
     * Track a user activity and optionally award points
     */
    trackActivity({ userId, action, metadata, awardPoints, }: TrackActivityOptions): Promise<void>;
    /**
     * Calculate points for an activity, considering limits and duplicates
     */
    private calculatePoints;
    /**
     * Award points to a user
     */
    private awardPoints;
    /**
     * Get user's total points
     */
    getUserPoints(userId: string): Promise<number>;
    /**
     * Get user's activity history
     */
    getUserActivities(userId: string, limit?: number, type?: ActivityType): Promise<unknown[]>;
    /**
     * Get user's points history
     */
    getUserPointsHistory(userId: string, limit?: number): Promise<unknown[]>;
    /**
     * Track authentication activities
     */
    trackAuthActivity(userId: string, action: "REGISTER" | "EMAIL_VERIFICATION" | "LOGIN" | "LOGOUT" | "PROFILE_UPDATE", metadata?: Record<string, unknown>): Promise<void>;
    /**
     * Track learning activities
     */
    trackLearningActivity(userId: string, action: string, metadata?: Record<string, unknown>): Promise<void>;
    /**
     * Manually award bonus points (admin action)
     */
    awardBonusPoints(userId: string, amount: number, reason: string): Promise<void>;
}
export declare const activityService: ActivityService;
export {};
//# sourceMappingURL=activity.d.ts.map