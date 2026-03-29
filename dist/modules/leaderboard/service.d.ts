import type { LeaderboardQuery, StudentLeaderboardEntry, TeamLeaderboardEntry, SchoolLeaderboardEntry, UserRankStats } from "./types";
export declare class LeaderboardService {
    static getUserRank(userId: string): Promise<UserRankStats>;
    static getStudentsLeaderboard(query: LeaderboardQuery): Promise<{
        students: StudentLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getTop3Students(): Promise<StudentLeaderboardEntry[]>;
    static getTeamsLeaderboard(query: LeaderboardQuery): Promise<{
        teams: TeamLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getTop3Teams(): Promise<TeamLeaderboardEntry[]>;
    static getSchoolsLeaderboard(query: LeaderboardQuery): Promise<{
        schools: SchoolLeaderboardEntry[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getTop3Schools(): Promise<SchoolLeaderboardEntry[]>;
    /**
     * Batch activity trends for a set of users (2 queries total instead of 2 per user).
     */
    private static batchActivityTrends;
    private static generateInitials;
}
//# sourceMappingURL=service.d.ts.map