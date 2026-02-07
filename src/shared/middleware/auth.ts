import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { UserRole } from "@prisma/client";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { message: "Unauthorized" } });
  }
  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: { message: "Invalid token" } });
  }
};

/**
 * Authorize middleware - checks if user has required role
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ success: false, error: { message: "Unauthorized" } });
    }

    console.log("user role", user)

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: "Forbidden - insufficient permissions" },
      });
    }

    next();
  };
};