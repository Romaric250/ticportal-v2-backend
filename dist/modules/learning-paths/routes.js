import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth.js";
import { LearningPathController } from "./controller.js";
const router = Router();
// Student routes with authentication
router.get("/learning-paths", authenticate, LearningPathController.getPathsForUser);
router.get("/learning-paths/:pathId/progress", authenticate, LearningPathController.getUserProgress);
router.post("/learning-paths/:pathId/enroll", authenticate, LearningPathController.enrollInPath);
router.post("/learning-paths/:pathId/modules/:moduleId/complete", authenticate, LearningPathController.completeModule);
router.post("/learning-paths/:pathId/modules/:moduleId/submit-quiz", authenticate, LearningPathController.submitQuiz);
// Admin routes
router.get("/admin/learning-paths", authenticate, LearningPathController.getAllPaths);
router.get("/admin/learning-paths/:pathId", authenticate, LearningPathController.getPathById);
router.post("/admin/learning-paths", authenticate, LearningPathController.createPath);
router.put("/admin/learning-paths/:pathId", authenticate, LearningPathController.updatePath);
router.delete("/admin/learning-paths/:pathId", authenticate, LearningPathController.deletePath);
router.post("/admin/learning-paths/:pathId/modules", authenticate, LearningPathController.addModule);
router.put("/admin/learning-paths/:pathId/modules/:moduleId", authenticate, LearningPathController.updateModule);
router.delete("/admin/learning-paths/:pathId/modules/:moduleId", authenticate, LearningPathController.deleteModule);
export default router;
//# sourceMappingURL=routes.js.map