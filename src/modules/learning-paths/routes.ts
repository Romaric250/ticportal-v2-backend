import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { LearningPathController } from "./controller";

const router = Router();

// Student routes with authentication
router.get("/learning-paths", authenticate, LearningPathController.getPathsForUser);
router.get("/learning-paths/enrollments", authenticate, LearningPathController.getAllEnrollmentStatus);
router.get("/learning-paths/:pathId/progress", authenticate, LearningPathController.getUserProgress);
router.get("/learning-paths/:pathId/modules", authenticate, LearningPathController.getPathModules);
router.get("/learning-paths/:pathId/modules/:moduleId/status", authenticate, LearningPathController.getModuleStatus);
router.post("/learning-paths/:pathId/enroll", authenticate, LearningPathController.enrollInPath);
router.post("/learning-paths/:pathId/complete", authenticate, LearningPathController.completeLearningPath);
router.delete("/learning-paths/:pathId/unenroll", authenticate, LearningPathController.unenrollFromPath);
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
