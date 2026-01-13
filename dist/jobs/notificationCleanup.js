import cron from "node-cron";
import { NotificationService } from "../modules/notifications/service.js";
import { logger } from "../shared/utils/logger.js";
/**
 * Cleanup expired notifications every minute
 */
export const startNotificationCleanup = () => {
    cron.schedule("*/1 * * * *", async () => {
        try {
            const deletedCount = await NotificationService.cleanupExpiredNotifications();
            if (deletedCount > 0) {
                logger.info({ deletedCount }, "🧹 [CRON] Notification cleanup completed");
            }
        }
        catch (error) {
            logger.error({ error: error.message }, "❌ [CRON] Notification cleanup failed");
        }
    });
    logger.info("⏰ [CRON] Notification cleanup scheduled (every 1 minute)");
};
//# sourceMappingURL=notificationCleanup.js.map