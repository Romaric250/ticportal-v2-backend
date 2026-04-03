import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.js";
import { PortfolioController } from "./controller.js";
const router = Router();
// Get complete portfolio overview
router.get("/portfolio", authenticate, PortfolioController.getPortfolioOverview);
export default router;
//# sourceMappingURL=routes.js.map