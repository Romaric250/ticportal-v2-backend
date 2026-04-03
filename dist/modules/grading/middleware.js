import { db } from "../../config/database";
import { UserRole } from "@prisma/client";
export async function requireReviewerOrAdmin(req, res, next) {
    try {
        const uid = req.user?.id || req.user?.userId;
        if (!uid) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await db.user.findUnique({
            where: { id: uid },
            select: { isReviewer: true, role: true },
        });
        const raw = user?.role;
        const role = typeof raw === "string" ? raw.replace(/-/g, "_").toUpperCase() : raw;
        const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
        if (isAdmin || user?.isReviewer) {
            return next();
        }
        return res.status(403).json({ success: false, message: "Admin or reviewer access required" });
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e?.message || "Server error" });
    }
}
export async function requireReviewer(req, res, next) {
    try {
        const uid = req.user?.id || req.user?.userId;
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
    }
    catch (e) {
        return res.status(500).json({ success: false, message: e?.message || "Server error" });
    }
}
export function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const raw = user.role;
    const role = typeof raw === "string" ? raw.replace(/-/g, "_").toUpperCase() : raw;
    if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
}
//# sourceMappingURL=middleware.js.map