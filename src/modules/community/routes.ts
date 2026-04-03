import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { CommunityController } from "./controller";

const router = Router();

router.get("/community/messages", authenticate, CommunityController.listMessages);
router.get("/community/messages/:rootId/thread", authenticate, CommunityController.listThread);
router.post("/community/messages", authenticate, CommunityController.createMessage);
router.post("/community/messages/bulk-delete", authenticate, CommunityController.bulkDeleteMessages);
router.patch("/community/messages/:id/pin", authenticate, CommunityController.setPinned);
router.patch("/community/messages/:id", authenticate, CommunityController.updateMessage);
router.delete("/community/messages/:id", authenticate, CommunityController.deleteMessage);

router.get("/community/push/vapid-public-key", authenticate, CommunityController.vapidPublicKey);
router.post("/community/push/subscribe", authenticate, CommunityController.subscribePush);
router.delete("/community/push/subscribe", authenticate, CommunityController.unsubscribePush);

export default router;
