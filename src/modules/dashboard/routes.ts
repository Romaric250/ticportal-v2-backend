import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { DashboardController } from "./controller";

const router = Router();

// Get complete dashboard overview
router.get(
  "/dashboard/overview",
  authenticate,
  DashboardController.getDashboardOverview
);

export default router;
