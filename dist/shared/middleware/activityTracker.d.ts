import type { Request, Response, NextFunction } from "express";
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
export declare const trackActivity: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware specifically for tracking authentication events
 * Use this in auth routes to ensure proper tracking
 */
export declare const trackAuthActivity: (action: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=activityTracker.d.ts.map