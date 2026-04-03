import { LeaderboardService } from "./service.js";
import { logger } from "../../shared/utils/logger.js";
export class LeaderboardController {
    /**
     * GET /api/leaderboard/me
     * Get current user's rank and stats
     */
    static async getMyRank(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const stats = await LeaderboardService.getUserRank(userId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get user rank");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch user rank",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/students
     * Get students leaderboard
     */
    static async getStudentsLeaderboard(req, res) {
        try {
            const query = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
            };
            if (req.query.search)
                query.search = req.query.search;
            if (req.query.school)
                query.school = req.query.school;
            if (req.query.minTP)
                query.minTP = parseInt(req.query.minTP);
            if (req.query.maxTP)
                query.maxTP = parseInt(req.query.maxTP);
            const result = await LeaderboardService.getStudentsLeaderboard(query);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get students leaderboard");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch students leaderboard",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/students/top
     * Get top 3 students
     */
    static async getTop3Students(req, res) {
        try {
            const students = await LeaderboardService.getTop3Students();
            res.json({
                success: true,
                data: students,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get top 3 students");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch top students",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/teams
     * Get teams leaderboard
     */
    static async getTeamsLeaderboard(req, res) {
        try {
            const query = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
                search: req.query.search,
                school: req.query.school,
            };
            const result = await LeaderboardService.getTeamsLeaderboard(query);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get teams leaderboard");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch teams leaderboard",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/teams/top
     * Get top 3 teams
     */
    static async getTop3Teams(req, res) {
        try {
            const teams = await LeaderboardService.getTop3Teams();
            res.json({
                success: true,
                data: teams,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get top 3 teams");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch top teams",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/schools
     * Get schools leaderboard
     */
    static async getSchoolsLeaderboard(req, res) {
        try {
            const query = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
                search: req.query.search,
            };
            const result = await LeaderboardService.getSchoolsLeaderboard(query);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get schools leaderboard");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch schools leaderboard",
                },
            });
        }
    }
    /**
     * GET /api/leaderboard/schools/top
     * Get top 3 schools
     */
    static async getTop3Schools(req, res) {
        try {
            const schools = await LeaderboardService.getTop3Schools();
            res.json({
                success: true,
                data: schools,
            });
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get top 3 schools");
            res.status(500).json({
                success: false,
                error: {
                    code: "LEADERBOARD_ERROR",
                    message: error.message || "Failed to fetch top schools",
                },
            });
        }
    }
}
//# sourceMappingURL=controller.js.map