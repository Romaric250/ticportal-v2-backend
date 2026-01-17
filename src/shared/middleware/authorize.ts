import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@prisma/client";

/**
 * Middleware to authorize users based on roles
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user found",
      });
    }

    const userRole = user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You do not have permission to access this resource",
        requiredRoles: allowedRoles,
        yourRole: userRole,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Admin access required",
    });
  }

  next();
};

/**
 * Middleware to check if user is super admin
 */
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Super Admin access required",
    });
  }

  next();
};
