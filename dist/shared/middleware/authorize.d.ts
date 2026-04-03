import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";
/**
 * Middleware to authorize users based on roles
 */
export declare const authorizeRoles: (...allowedRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user is admin
 */
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware to check if user is super admin
 */
export declare const isSuperAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authorize.d.ts.map