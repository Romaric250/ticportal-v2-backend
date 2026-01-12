import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { LearningPathController } from "./controller";

const router = Router();

// Student routes with authentication
router.get("/learning-paths", authenticate, LearningPathController.getPathsForUser);
router.get("/learning-paths/:pathId/progress", authenticate, LearningPathController.getUserProgress);
router.post("/learning-paths/:pathId/enroll", authenticate, LearningPathController.enrollInPath);
router.post("/learning-paths/:pathId/modules/:moduleId/complete", authenticate, LearningPathController.completeModule);
router.post("/learning-paths/:pathId/modules/:moduleId/submit-quiz", authenticate, LearningPathController.submitQuiz);

export default router;
