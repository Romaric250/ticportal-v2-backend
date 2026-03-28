import type { Request, Response, NextFunction } from "express";
import { db } from "../../config/database";
import { UserRole } from "@prisma/client";

export async function requireReviewerOrAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = (req as any).user?.id || (req as any).user?.userId;
    if (!uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await db.user.findUnique({
      where: { id: uid },
      select: { isReviewer: true, role: true },
    });
    const raw = user?.role as string;
    const role = typeof raw === "string" ? raw.replace(/-/g, "_").toUpperCase() : raw;
    const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
    if (isAdmin || user?.isReviewer) {
      return next();
    }
    return res.status(403).json({ success: false, message: "Admin or reviewer access required" });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
}

export async function requireReviewer(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = (req as any).user?.id || (req as any).user?.userId;
    if (!uid) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await db.user.findUnique({
      where: { id: uid },
      select: { isReviewer: true, role: true },
    });
    if (!user?.isReviewer) {
      return res.status(403).json({ success: false, message: "Reviewer access required" });
    }
    next();
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || "Server error" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const raw = user.role as string;
  const role = typeof raw === "string" ? raw.replace(/-/g, "_").toUpperCase() : raw;
  if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}
