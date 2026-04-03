import type { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { CommunityService } from "./service";
import { getIO } from "../../socket/ioHolder";
import { isPushConfigured, getVapidPublicKey } from "./push";
import { logger } from "../../shared/utils/logger";

function normRole(r: unknown): UserRole {
  if (typeof r !== "string") return r as UserRole;
  return r.replace(/-/g, "_").toUpperCase() as UserRole;
}

function emitToCommunity(event: string, payload: unknown) {
  try {
    getIO()?.to("community:global").emit(event, payload);
  } catch (e) {
    logger.warn({ e, event }, "community socket emit failed");
  }
}

export class CommunityController {
  static async listMessages(req: Request, res: Response) {
    try {
      const limit = Math.min(120, Math.max(1, Number(req.query.limit) || 80));
      const data = await CommunityService.listRootMessages(limit);
      res.json({ success: true, data });
    } catch (e: unknown) {
      logger.error({ e }, "community listMessages");
      res.status(500).json({ success: false, message: "Failed to load messages" });
    }
  }

  static async listThread(req: Request, res: Response) {
    try {
      const rootId = req.params.rootId;
      if (!rootId) {
        return res.status(400).json({ success: false, message: "Missing root id" });
      }
      const thread = await CommunityService.listThread(rootId);
      res.json({ success: true, data: { messages: thread } });
    } catch (e: unknown) {
      logger.error({ e }, "community listThread");
      res.status(500).json({ success: false, message: "Failed to load thread" });
    }
  }

  static async createMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const role = normRole((req as any).user?.role);
      const { body, imageUrls, parentId } = req.body ?? {};
      const result = await CommunityService.createMessage(userId, role, {
        body: typeof body === "string" ? body : "",
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        parentId: parentId ?? null,
      });
      if (!result.ok) {
        return res.status(result.status ?? 400).json({ success: false, message: result.error });
      }
      emitToCommunity("community:message:new", { message: result.message });
      if (result.message.parentId) {
        const count = await CommunityService.countReplies(result.message.parentId);
        emitToCommunity("community:thread:count", {
          rootId: result.message.parentId,
          replyCount: count,
        });
      }
      res.status(201).json({ success: true, data: result.message });
    } catch (e: unknown) {
      logger.error({ e }, "community createMessage");
      res.status(500).json({ success: false, message: "Failed to send message" });
    }
  }

  static async updateMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: "Missing id" });
      }
      const { body, imageUrls } = req.body ?? {};
      const payload: { body: string; imageUrls?: string[] } = {
        body: typeof body === "string" ? body : "",
      };
      if (Array.isArray(imageUrls)) {
        payload.imageUrls = imageUrls;
      }
      const result = await CommunityService.updateMessage(userId, id, payload);
      if (!result.ok) {
        return res.status(result.status ?? 400).json({ success: false, message: result.error });
      }
      emitToCommunity("community:message:updated", { message: result.message });
      res.json({ success: true, data: result.message });
    } catch (e: unknown) {
      logger.error({ e }, "community updateMessage");
      res.status(500).json({ success: false, message: "Failed to update message" });
    }
  }

  static async bulkDeleteMessages(req: Request, res: Response) {
    try {
      const role = normRole((req as any).user?.role);
      const raw = req.body?.ids;
      const ids = Array.isArray(raw) ? raw.filter((id: unknown) => typeof id === "string") : [];
      const result = await CommunityService.bulkDeleteMessages(role, ids);
      if (!result.ok) {
        return res.status(result.status ?? 400).json({ success: false, message: result.error });
      }
      emitToCommunity("community:messages:bulk-deleted", { ids: result.deletedIds });
      res.json({ success: true, data: { deletedIds: result.deletedIds } });
    } catch (e: unknown) {
      logger.error({ e }, "community bulkDeleteMessages");
      res.status(500).json({ success: false, message: "Failed to bulk delete messages" });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const role = normRole((req as any).user?.role);
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: "Missing id" });
      }
      const result = await CommunityService.deleteMessage(userId, role, id);
      if (!result.ok) {
        return res.status(result.status ?? 400).json({ success: false, message: result.error });
      }
      emitToCommunity("community:message:deleted", {
        id: result.deletedId,
        parentId: result.parentId,
      });
      if (result.parentId) {
        const count = await CommunityService.countReplies(result.parentId);
        emitToCommunity("community:thread:count", {
          rootId: result.parentId,
          replyCount: count,
        });
      }
      res.json({ success: true, data: { id: result.deletedId } });
    } catch (e: unknown) {
      logger.error({ e }, "community deleteMessage");
      res.status(500).json({ success: false, message: "Failed to delete message" });
    }
  }

  static async setPinned(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const role = normRole((req as any).user?.role);
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: "Missing id" });
      }
      const pinned = Boolean(req.body?.pinned);
      const result = await CommunityService.setPinned(userId, role, id, pinned);
      if (!result.ok) {
        return res.status(result.status ?? 400).json({ success: false, message: result.error });
      }
      emitToCommunity("community:message:pin", {
        messageId: result.message.id,
        isPinned: result.message.isPinned,
        message: result.message,
      });
      res.json({ success: true, data: result.message });
    } catch (e: unknown) {
      logger.error({ e }, "community setPinned");
      res.status(500).json({ success: false, message: "Failed to update pin" });
    }
  }

  static async vapidPublicKey(_req: Request, res: Response) {
    if (!isPushConfigured()) {
      return res.json({ success: true, data: { publicKey: null, configured: false } });
    }
    res.json({ success: true, data: { publicKey: getVapidPublicKey(), configured: true } });
  }

  static async subscribePush(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const { endpoint, keys } = req.body ?? {};
      if (!endpoint || !keys?.p256dh || !keys?.auth) {
        return res.status(400).json({ success: false, message: "Invalid subscription" });
      }
      if (!isPushConfigured()) {
        return res.status(503).json({ success: false, message: "Push not configured on server" });
      }
      await CommunityService.savePushSubscription(userId, { endpoint, keys });
      res.json({ success: true });
    } catch (e: unknown) {
      logger.error({ e }, "community subscribePush");
      res.status(500).json({ success: false, message: "Failed to save subscription" });
    }
  }

  static async unsubscribePush(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId as string;
      const endpoint = req.body?.endpoint as string | undefined;
      if (!endpoint) {
        return res.status(400).json({ success: false, message: "endpoint required" });
      }
      await CommunityService.removePushSubscription(userId, endpoint);
      res.json({ success: true });
    } catch (e: unknown) {
      logger.error({ e }, "community unsubscribePush");
      res.status(500).json({ success: false, message: "Failed to remove subscription" });
    }
  }
}
