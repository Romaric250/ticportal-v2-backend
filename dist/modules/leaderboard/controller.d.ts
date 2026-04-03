import type { Request, Response } from "express";
export declare class LeaderboardController {
    /**
     * GET /api/leaderboard/me
     * Get current user's rank and stats
     */
    static getMyRank(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/leaderboard/students
     * Get students leaderboard
     */
    static getStudentsLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/leaderboard/students/top
     * Get top 3 students
     */
    static getTop3Students(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/leaderboard/teams
     * Get teams leaderboard
     */
    static getTeamsLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/leaderboard/teams/top
     * Get top 3 teams
     */
    static getTop3Teams(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/leaderboard/schools
     * Get schools leaderboard
     */
    static getSchoolsLeaderboard(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/leaderboard/schools/top
     * Get top 3 schools
     */
    static getTop3Schools(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map