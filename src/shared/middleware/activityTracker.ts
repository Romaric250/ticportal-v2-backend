import type { Request, Response, NextFunction } from "express";
import { activityService } from "../services/activity";
import { logger } from "../utils/logger";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to track all authenticated user activities
 * Should be placed after authentication middleware
 */
export const trackActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Only track activities for authenticated users
  if (!req.user?.id) {
    return next();
  }

  // Skip tracking for health checks and certain routes
  const skipRoutes = ["/health", "/api/docs", "/favicon.ico"];
  if (skipRoutes.some((route) => req.path.includes(route))) {
    return next();
  }

  // Capture request info
  const userId = req.user.id;
  const method = req.method;
  const path = req.path;
  const action = determineAction(method, path);

  // Track activity after response is sent (non-blocking)
  res.on("finish", async () => {
    // Only track successful requests (2xx, 3xx status codes)
    if (res.statusCode >= 200 && res.statusCode < 400) {
      try {
        await activityService.trackActivity({
          userId,
          action,
          metadata: {
            method,
            path,
            statusCode: res.statusCode,
            userAgent: req.get("user-agent"),
            ip: req.ip,
          },
        });
      } catch (error) {
        // Log but don't break the request
        logger.error({ error, userId, action }, "Failed to track activity");
      }
    }
  });

  next();
};

/**
 * Determine the action based on the HTTP method and path
 */
function determineAction(method: string, path: string): string {
  // Auth routes
  if (path.includes("/auth/register")) return "REGISTER";
  if (path.includes("/auth/verify-otp")) return "EMAIL_VERIFICATION";
  if (path.includes("/auth/login")) return "LOGIN";
  if (path.includes("/auth/logout")) return "LOGOUT";

  // User/Profile routes
  if (path.includes("/users/profile") && method === "PUT")
    return "PROFILE_UPDATE";
  if (path.includes("/users/profile") && method === "GET")
    return "PROFILE_VIEW";

  // Team routes
  if (path.includes("/teams") && method === "POST") return "TEAM_CREATE";
  if (path.includes("/teams") && method === "GET") return "TEAM_VIEW";
  if (path.includes("/teams") && path.includes("/join")) return "TEAM_JOIN";
  if (path.includes("/teams") && path.includes("/chat")) return "MESSAGE_SEND";

  // Squad routes
  if (path.includes("/squads") && method === "POST") return "SQUAD_CREATE";
  if (path.includes("/squads") && path.includes("/join")) return "SQUAD_JOIN";

  // Hackathon routes
  if (path.includes("/hackathons") && path.includes("/register"))
    return "HACKATHON_REGISTER";
  if (path.includes("/submissions") && method === "POST") return "SUBMISSION";
  if (path.includes("/submissions") && method === "PUT")
    return "SUBMISSION_UPDATE";

  // Learning routes
  if (path.includes("/stages") && method === "GET") return "STAGE_VIEW";
  if (path.includes("/stages") && path.includes("/complete"))
    return "STAGE_COMPLETE";
  if (path.includes("/quizzes") && method === "POST") return "QUIZ_ATTEMPT";
  if (path.includes("/resources") && method === "GET") return "RESOURCE_VIEW";

  // Mentorship routes
  if (path.includes("/mentor-requests") && method === "POST")
    return "REQUEST_MENTOR";
  if (path.includes("/mentor-sessions") && method === "POST")
    return "SESSION_ATTEND";

  // Default generic action
  return `${method}_${path.split("/")[2] || "unknown"}`.toUpperCase();
}

/**
 * Middleware specifically for tracking authentication events
 * Use this in auth routes to ensure proper tracking
 */
export const trackAuthActivity = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store action in res.locals for later tracking
    res.locals.authAction = action;

    // Track after response
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        try {
          // For registration, user ID might be in response body
          const userId =
            req.user?.id ||
            res.locals.userId ||
            (req.body as { id?: string }).id;

          if (userId) {
            await activityService.trackAuthActivity(userId, action as any, {
              method: req.method,
              path: req.path,
              ip: req.ip,
            });
          }
        } catch (error) {
          logger.error({ error, action }, "Failed to track auth activity");
        }
      }
    });

    next();
  };
};
