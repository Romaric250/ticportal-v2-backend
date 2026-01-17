import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { LeaderboardController } from "./controller";

const router = Router();

// ==================== USER ROUTES ====================

// Get current user's rank and stats
router.get("/leaderboard/me", authenticate, LeaderboardController.getMyRank);

// ==================== STUDENTS LEADERBOARD ====================

// Get students leaderboard (paginated)
router.get("/leaderboard/students", authenticate, LeaderboardController.getStudentsLeaderboard);

// Get top 3 students
router.get("/leaderboard/students/top", authenticate, LeaderboardController.getTop3Students);

// ==================== TEAMS LEADERBOARD ====================

// Get teams leaderboard (paginated)
router.get("/leaderboard/teams", authenticate, LeaderboardController.getTeamsLeaderboard);

// Get top 3 teams
router.get("/leaderboard/teams/top", authenticate, LeaderboardController.getTop3Teams);

// ==================== SCHOOLS LEADERBOARD ====================

// Get schools leaderboard (paginated)
router.get("/leaderboard/schools", authenticate, LeaderboardController.getSchoolsLeaderboard);

// Get top 3 schools
router.get("/leaderboard/schools/top", authenticate, LeaderboardController.getTop3Schools);

export default router;
