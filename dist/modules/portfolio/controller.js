import { PortfolioService } from "./service.js";
import { logger } from "../../shared/utils/logger.js";
export class PortfolioController {
    /**
     * GET /api/portfolio
     * Get complete portfolio overview
     */
    static async getPortfolioOverview(req, res) {
        try {
            const userId = req.user?.userId;
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
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get portfolio overview");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch portfolio data",
            });
        }
    }
}
//# sourceMappingURL=controller.js.map