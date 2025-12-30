import { Router } from "express";
import { UserController } from "./controller";

const router = Router();

router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);

export default router;