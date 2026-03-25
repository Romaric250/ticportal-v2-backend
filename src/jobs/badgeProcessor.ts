import cron from "node-cron";
import { BadgeService } from "../modules/badges/service";
import { logger } from "../shared/utils/logger";

/**
 * Process failed payment badge awards every 30 minutes
 * This ensures users with confirmed payments receive the "Paid Student" badge
 */
export const startBadgeProcessor = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      logger.info("🏅 [CRON] Badge processor started");
      await BadgeService.processFailedPaymentBadges();
    } catch (error) {
      logger.error(
        { error: (error as Error).message },
        "[CRON] Badge processor failed"
      );
    }
  });

  logger.info("⏰ [CRON] Badge processor scheduled (every 30 minutes)");
};
