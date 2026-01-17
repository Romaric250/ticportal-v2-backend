import type { LeaderboardQuery, StudentLeaderboardEntry, TeamLeaderboardEntry, SchoolLeaderboardEntry, UserRankStats } from "./types";
export declare class LeaderboardService {
    /**
     * Get current user's rank and stats
     */
    static getUserRank(userId: string): Promise<UserRankStats>;
    /**
     * Get students leaderboard
     */
    static getStudentsLeaderboard(query: LeaderboardQuery): Promise<{
        students: StudentLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get top 3 students
     */
    static getTop3Students(): Promise<StudentLeaderboardEntry[]>;
    /**
     * Get teams leaderboard
     */
    static getTeamsLeaderboard(query: LeaderboardQuery): Promise<{
        teams: TeamLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get top 3 teams
     */
    static getTop3Teams(): Promise<TeamLeaderboardEntry[]>;
    /**
     * Get schools leaderboard
     */
    static getSchoolsLeaderboard(query: LeaderboardQuery): Promise<{
        schools: SchoolLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get top 3 schools
     */
    static getTop3Schools(): Promise<SchoolLeaderboardEntry[]>;
    /**
     * Generate user initials safely
     */
    private static generateInitials;
    /**
     * Calculate activity trend for user (last 7 days vs previous 7 days)
     */
    private static calculateActivityTrend;
    /**
     * Calculate rank change for user
     */
    private static calculateRankChange;
    /**
     * Calculate activity trend for team
     */
    private static calculateTeamActivityTrend;
    /**
     * Calculate rank change for team
     */
    private static calculateTeamRankChange;
    /**
     * Calculate activity trend for school
     */
    private static calculateSchoolActivityTrend;
    /**
     * Calculate rank change for school
     */
    private static calculateSchoolRankChange;
}
//# sourceMappingURL=service.d.ts.map