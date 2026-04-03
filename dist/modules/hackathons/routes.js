import { Router } from "express";
import { HackathonController } from "./controller.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
const router = Router();
router.get("/", cacheMiddleware(), HackathonController.getHackathons);
export default router;
//# sourceMappingURL=routes.js.map