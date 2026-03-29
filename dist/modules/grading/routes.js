import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.js";
import { GradingController } from "./controller.js";
import { requireAdmin, requireReviewer, requireReviewerOrAdmin } from "./middleware.js";
const router = Router();
router.use(authenticate);
// Rubric (reviewers + admins read; admins write)
router.get("/grading/rubric", requireReviewerOrAdmin, GradingController.getRubric);
router.post("/grading/rubric", requireAdmin, GradingController.postRubric);
// Grading actions
router.post("/grading/teams/:teamId/submit", requireReviewer, GradingController.submitGrade);
router.get("/grading/teams/:teamId/reviews", requireReviewerOrAdmin, GradingController.getTeamReviews);
router.post("/grading/teams/:teamId/finalize", requireAdmin, GradingController.finalize);
router.post("/admin/grading/finalize-bulk", requireAdmin, GradingController.finalizeBulk);
router.post("/grading/teams/:teamId/publish", requireAdmin, GradingController.publish);
// Reviewer
router.get("/reviewer/dashboard", requireReviewer, GradingController.reviewerDashboard);
router.get("/reviewer/assignments", requireReviewer, GradingController.reviewerAssignments);
// Admin — users / reviewers (GET /admin/users/reviewers registered in admin/routes before /users/:userId)
router.post("/admin/users/:userId/reviewer", requireAdmin, GradingController.setReviewer);
// Admin — teams & workload (GET /admin/teams/pending-grades registered in admin/routes before /teams/:teamId)
router.get("/admin/reviewers/workload", requireAdmin, GradingController.reviewerWorkload);
// Admin — assignments
router.post("/admin/assignments/auto", requireAdmin, GradingController.autoAssign);
router.post("/admin/assignments/bulk-same-reviewers", requireAdmin, GradingController.bulkAssignSameReviewers);
router.post("/admin/assignments/manual", requireAdmin, GradingController.manualAssign);
router.post("/admin/assignments/unassign", requireAdmin, GradingController.unassignReviewer);
router.get("/admin/assignments/team/:teamId", requireAdmin, GradingController.assignmentsForTeam);
router.get("/admin/assignments", requireAdmin, GradingController.listAssignments);
// Admin — leaderboard
router.get("/admin/leaderboard/config", requireAdmin, GradingController.leaderboardConfigGet);
router.post("/admin/leaderboard/config", requireAdmin, GradingController.leaderboardConfigPost);
router.get("/admin/leaderboard/teams", requireAdmin, GradingController.leaderboardTeams);
router.post("/admin/leaderboard/apply", requireAdmin, GradingController.leaderboardApply);
// Admin — reports (lean leaderboard + reviewer rows; team detail on demand)
router.get("/admin/grading/reports", requireAdmin, GradingController.gradingReports);
router.get("/admin/grading/reports/teams/:teamId/detail", requireAdmin, GradingController.gradingReportTeamDetail);
export default router;
//# sourceMappingURL=routes.js.map