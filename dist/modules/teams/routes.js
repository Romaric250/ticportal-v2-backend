import { Router } from "express";
import { TeamController } from "./controller";
import { cacheMiddleware } from "../../shared/middleware/cache";
const router = Router();
router.get("/", cacheMiddleware(), TeamController.getTeams);
export default router;
//# sourceMappingURL=routes.js.map