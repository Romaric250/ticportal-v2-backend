import type { Request, Response } from "express";
import { PortfolioService } from "./service";
import { logger } from "../../shared/utils/logger";

export class PortfolioController {
  /**
   * GET /api/portfolio
   * Get complete portfolio overview
   */
  static async getPortfolioOverview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const portfolio = await PortfolioService.getPortfolioOverview(userId);

      res.json({
        success: true,
        data: portfolio,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, "Failed to get portfolio overview");
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch portfolio data",
      });
    }
  }
}
