import rateLimit from "express-rate-limit";
import { env } from "../../config/env";
// Create a bypass middleware when rate limiting is disabled
const bypassMiddleware = (req, res, next) => {
    next();
};
export const authRateLimit = env.isRateLimitActive
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 min
        max: 100, // 5 requests per window
        message: { success: false, error: { message: "Too many requests, try again later" } },
        standardHeaders: true,
        legacyHeaders: false,
    })
    : bypassMiddleware;
export const generalRateLimit = env.isRateLimitActive
    ? rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { success: false, error: { message: "Too many requests" } },
    })
    : bypassMiddleware;
//# sourceMappingURL=rateLimit.js.map