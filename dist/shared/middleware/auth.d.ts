import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Authorize middleware - checks if user has required role
 */
export declare const authorize: (allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map