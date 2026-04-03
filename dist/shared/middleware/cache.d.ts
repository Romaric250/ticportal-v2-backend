import type { Request, Response, NextFunction } from "express";
export declare const cacheMiddleware: (ttl?: number) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=cache.d.ts.map