import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 requests per window
  message: { success: false, error: { message: "Too many requests, try again later" } },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { message: "Too many requests" } },
});