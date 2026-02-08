import cron from "node-cron";
import { PaymentCommissionService } from "../modules/affiliate/payment-commission.service";
import { logger } from "../shared/utils/logger";

/**
 * Process failed commission calculations every 30 minutes
 * This ensures commissions are calculated for payments that may have failed initially
 */
export const startCommissionProcessor = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      logger.info("💰 [CRON] Commission processor started");
      await PaymentCommissionService.processFailedCommissions();
    } catch (error) {
      logger.error(
        { error: (error as Error).message },
        "❌ [CRON] Commission processor failed"
      );
    }
  });

  logger.info("⏰ [CRON] Commission processor scheduled (every 30 minutes)");
};
