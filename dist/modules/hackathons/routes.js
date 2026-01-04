import { Router } from "express";
import { HackathonController } from "./controller";
import { cacheMiddleware } from "../../shared/middleware/cache";
const router = Router();
router.get("/", cacheMiddleware(), HackathonController.getHackathons);
export default router;
//# sourceMappingURL=routes.js.map