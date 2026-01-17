import { DashboardService } from "./service.js";
import { logger } from "../../shared/utils/logger.js";
export class DashboardController {
    /**
     * GET /api/dashboard/overview
     * Get complete dashboard overview
     */
    static async getDashboardOverview(req, res) {
        try {
            const userId = req.user?.userId;
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
        }
        catch (error) {
            logger.error({ error: error.message }, "Failed to get dashboard overview");
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch dashboard data",
            });
        }
    }
}
//# sourceMappingURL=controller.js.map