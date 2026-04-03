import type { Request, Response, NextFunction } from "express";
export declare function requireReviewerOrAdmin(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function requireReviewer(req: Request, res: Response, next: NextFunction): Promise<any>;
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): any;
//# sourceMappingURL=middleware.d.ts.map