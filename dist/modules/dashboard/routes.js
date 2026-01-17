import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.js";
import { DashboardController } from "./controller.js";
const router = Router();
// Get complete dashboard overview
router.get("/dashboard/overview", authenticate, DashboardController.getDashboardOverview);
export default router;
//# sourceMappingURL=routes.js.map