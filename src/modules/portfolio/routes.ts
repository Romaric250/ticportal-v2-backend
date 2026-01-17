import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { PortfolioController } from "./controller";

const router = Router();

// Get complete portfolio overview
router.get(
  "/portfolio",
  authenticate,
  PortfolioController.getPortfolioOverview
);

export default router;
