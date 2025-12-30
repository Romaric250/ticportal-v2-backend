import { Router } from "express";
import { SquadController } from "./controller";
import { cacheMiddleware } from "../../shared/middleware/cache";

const router = Router();

router.get("/", cacheMiddleware(), SquadController.getSquads);
router.get("/:id", cacheMiddleware(), SquadController.getSquad);

export default router;