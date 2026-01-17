import type { Request, Response } from "express";
import { DashboardService } from "./service";
import { logger } from "../../shared/utils/logger";

export class DashboardController {
  /**
   * GET /api/dashboard/overview
   * Get complete dashboard overview
   */
  static async getDashboardOverview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const overview = await DashboardService.getDashboardOverview(userId);

      res.json({
        success: true,
        data: overview,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get dashboard overview");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch dashboard data",
      });
    }
  }
}
