import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { authorizeRoles } from "../../shared/middleware/authorize";
import { BadgeController } from "./controller";

const router = Router();

// ==================== PUBLIC/USER ROUTES ====================

// Get all available badges
router.get("/badges/all", authenticate, BadgeController.getAllBadges);

// Get current user's badges
router.get("/badges/my-badges", authenticate, BadgeController.getMyBadges);

// Get badge progress for current user
router.get("/badges/progress", authenticate, BadgeController.getBadgeProgress);

// Check and award badges for current user
router.post("/badges/check", authenticate, BadgeController.checkBadges);

// Get badges for specific user (public)
router.get("/badges/user/:userId", authenticate, BadgeController.getUserBadges);

// Get badge leaderboard
router.get("/badges/leaderboard", authenticate, BadgeController.getLeaderboard);

// ==================== ADMIN ROUTES ====================

// Get all badges with full details (Admin)
router.get(
  "/badges/admin/all",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminGetAllBadges
);

// Get specific badge details (Admin)
router.get(
  "/badges/admin/badge/:badgeId",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminGetBadge
);

// Update badge information
router.put(
  "/badges/admin/:badgeId",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminUpdateBadge
);

// Manually award badge to user
router.post(
  "/badges/admin/award",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminAwardBadge
);

// Revoke badge from user
router.delete(
  "/badges/admin/revoke",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminRevokeBadge
);

// Get badge statistics
router.get(
  "/badges/admin/stats",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminGetBadgeStats
);

// Sync badges for all users
router.post(
  "/badges/admin/sync-all",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminSyncAllBadges
);

// Get detailed badge info for specific user
router.get(
  "/badges/admin/user-badges/:userId",
  authenticate,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  BadgeController.adminGetUserBadges
);

export default router;
