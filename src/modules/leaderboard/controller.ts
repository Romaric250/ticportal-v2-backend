import type { Request, Response } from "express";
import { LeaderboardService } from "./service";
import { logger } from "../../shared/utils/logger";

export class LeaderboardController {
  /**
   * GET /api/leaderboard/me
   * Get current user's rank and stats
   */
  static async getMyRank(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

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
    } catch (error: any) {
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
  static async getStudentsLeaderboard(req: Request, res: Response) {
    try {
      const query: any = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      if (req.query.search) query.search = req.query.search as string;
      if (req.query.school) query.school = req.query.school as string;
      if (req.query.minTP) query.minTP = parseInt(req.query.minTP as string);
      if (req.query.maxTP) query.maxTP = parseInt(req.query.maxTP as string);

      const result = await LeaderboardService.getStudentsLeaderboard(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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
  static async getTop3Students(req: Request, res: Response) {
    try {
      const students = await LeaderboardService.getTop3Students();

      res.json({
        success: true,
        data: students,
      });
    } catch (error: any) {
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
  static async getTeamsLeaderboard(req: Request, res: Response) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
        school: req.query.school as string,
      };

      const result = await LeaderboardService.getTeamsLeaderboard(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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
  static async getTop3Teams(req: Request, res: Response) {
    try {
      const teams = await LeaderboardService.getTop3Teams();

      res.json({
        success: true,
        data: teams,
      });
    } catch (error: any) {
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
  static async getSchoolsLeaderboard(req: Request, res: Response) {
    try {
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        search: req.query.search as string,
      };

      const result = await LeaderboardService.getSchoolsLeaderboard(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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
  static async getTop3Schools(req: Request, res: Response) {
    try {
      const schools = await LeaderboardService.getTop3Schools();

      res.json({
        success: true,
        data: schools,
      });
    } catch (error: any) {
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
