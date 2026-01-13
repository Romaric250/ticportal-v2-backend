import { Router } from "express";
import { SquadController } from "./controller.js";
import { cacheMiddleware } from "../../shared/middleware/cache.js";
const router = Router();
router.get("/", cacheMiddleware(), SquadController.getSquads);
router.get("/:id", cacheMiddleware(), SquadController.getSquad);
export default router;
//# sourceMappingURL=routes.js.map