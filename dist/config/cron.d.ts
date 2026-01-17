import { CronJob } from "cron";
/**
 * Health Check Job - Every 14 minutes
 * Keeps the server alive on free hosting
 */
export declare const healthCheckJob: CronJob<null, null>;
/**
 * Badge Award Job - Every minute (for testing) or every hour (production)
 * Automatically checks and awards badges to all users
 */
export declare const badgeAwardJob: CronJob<null, null>;
/**
 * Start all cron jobs
 */
export declare const startCronJobs: () => void;
/**
 * Stop all cron jobs
 */
export declare const stopCronJobs: () => void;
export default healthCheckJob;
//# sourceMappingURL=cron.d.ts.map