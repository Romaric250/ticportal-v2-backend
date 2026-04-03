import { CronJob } from "cron";
import https from "https";
import { logger } from "../shared/utils/logger";
/**
 * Health Check Job - Every 14 minutes
 * Keeps the server alive on free hosting
 */
export const healthCheckJob = new CronJob("*/14 * * * *", () => {
    https
        .get(`${process.env.API_URL}/health`, (res) => {
        if (res.statusCode === 200) {
            logger.info("✅ Health check successful");
        }
        else {
            logger.warn({ statusCode: res.statusCode }, "⚠️ Health check failed");
        }
    })
        .on("error", (e) => {
        logger.error({ error: e }, "❌ Health check error");
    });
});
/**
 * Badge Award Job - Every hour
 * Automatically checks and awards badges to all users
 */
export const badgeAwardJob = new CronJob("0 * * * *", // Every hour at :00
async () => {
    try {
        logger.info("🏅 Badge award cron triggered at " + new Date().toISOString());
        // Lazy load to avoid circular dependency issues
        const { BadgeService } = await import("../modules/badges/service");
        logger.info("📊 Checking badges for all users...");
        const totalAwarded = await BadgeService.checkBadgesForAllUsers();
        logger.info({ totalAwarded }, `🎉 Badge award job completed - ${totalAwarded} badges awarded`);
    }
    catch (error) {
        logger.error({
            error: error.message,
            stack: error.stack
        }, "❌ Badge award job failed");
        console.error("Badge award error:", error);
    }
}, null, // onComplete callback
false, // Don't start immediately - we'll start it manually
"UTC" // Timezone
);
/**
 * Start all cron jobs
 */
export const startCronJobs = () => {
    try {
        // Start health check
        healthCheckJob.start();
        logger.info("✅ Health check cron started: Every 14 minutes");
        // Start badge awards
        badgeAwardJob.start();
        logger.info("✅ Badge award cron started: Every 1 hour");
        logger.info("🚀 All cron jobs running!");
        // Test badge job immediately (optional)
        logger.info("🧪 Testing badge job now...");
        badgeAwardJob.fireOnTick();
    }
    catch (error) {
        logger.error({ error: error.message }, "Failed to start cron jobs");
        console.error("Cron startup error:", error);
    }
};
/**
 * Stop all cron jobs
 */
export const stopCronJobs = () => {
    try {
        healthCheckJob.stop();
        badgeAwardJob.stop();
        logger.info("🛑 All cron jobs stopped");
    }
    catch (error) {
        logger.error({ error: error.message }, "Failed to stop cron jobs");
    }
};
// Default export for backward compatibility
export default healthCheckJob;
// CRON SCHEDULE GUIDE:
// */1 * * * * - Every minute (TESTING)
// */5 * * * * - Every 5 minutes
// 0 * * * * - Every hour at :00 (PRODUCTION)
// 0 */2 * * * - Every 2 hours
// 0 */6 * * * - Every 6 hours
// 0 0 * * * - Every day at midnight
//# sourceMappingURL=cron.js.map