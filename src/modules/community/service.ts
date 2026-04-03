import { UserRole } from "@prisma/client";
import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { env } from "../../config/env";
import { notifyCommunityPush } from "./push";

const CHANNEL = "global";
const MAX_BODY = 8000;
const MAX_IMAGES = 8;

const authorSelect = {
  id: true,
  firstName: true,
  lastName: true,
  role: true,
  profilePhoto: true,
} as const;

export type CommunityMessageDTO = {
  id: string;
  channelId: string;
  body: string;
  imageUrls: string[];
  parentId: string | null;
  isPinned: boolean;
  pinnedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profilePhoto: string | null;
  };
  replyCount: number;
};

function toDto(
  row: {
    id: string;
    channelId: string;
    body: string;
    imageUrls: string[];
    parentId: string | null;
    isPinned: boolean;
    pinnedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      profilePhoto: string | null;
    };
    _count?: { replies: number };
  },
): CommunityMessageDTO {
  return {
    id: row.id,
    channelId: row.channelId,
    body: row.body,
    imageUrls: row.imageUrls ?? [],
    parentId: row.parentId,
    isPinned: row.isPinned,
    pinnedAt: row.pinnedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    author: row.author,
    replyCount: row._count?.replies ?? 0,
  };
}

export class CommunityService {
  static isAdminRole(role: unknown): boolean {
    const r = typeof role === "string" ? role.replace(/-/g, "_").toUpperCase() : String(role);
    return r === "ADMIN" || r === "SUPER_ADMIN";
  }

  static async listRootMessages(limit = 80): Promise<{
    pinned: CommunityMessageDTO[];
    messages: CommunityMessageDTO[];
  }> {
    const pinned = await db.communityMessage.findMany({
      where: { channelId: CHANNEL, parentId: null, isPinned: true },
      orderBy: [{ pinnedAt: "desc" }],
      include: {
        author: { select: authorSelect },
        _count: { select: { replies: true } },
      },
    });

    const rest = await db.communityMessage.findMany({
      where: {
        channelId: CHANNEL,
        parentId: null,
        isPinned: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: { select: authorSelect },
        _count: { select: { replies: true } },
      },
    });

    return {
      pinned: pinned.map((p) => toDto(p)),
      messages: rest.reverse().map((m) => toDto(m)),
    };
  }

  static async countReplies(rootId: string): Promise<number> {
    return db.communityMessage.count({
      where: { parentId: rootId, channelId: CHANNEL },
    });
  }

  static async listThread(rootId: string): Promise<CommunityMessageDTO[]> {
    const root = await db.communityMessage.findFirst({
      where: { id: rootId, channelId: CHANNEL, parentId: null },
    });
    if (!root) return [];

    const replies = await db.communityMessage.findMany({
      where: { channelId: CHANNEL, parentId: rootId },
      orderBy: { createdAt: "asc" },
      include: { author: { select: authorSelect } },
    });

    return replies.map((r) => toDto(r));
  }

  static validatePayload(body: string, imageUrls: string[]): { ok: true } | { ok: false; error: string } {
    const t = body?.trim() ?? "";
    if (!t && imageUrls.length === 0) {
      return { ok: false, error: "Message cannot be empty" };
    }
    if (t.length > MAX_BODY) {
      return { ok: false, error: `Message too long (max ${MAX_BODY} characters)` };
    }
    if (imageUrls.length > MAX_IMAGES) {
      return { ok: false, error: `Too many images (max ${MAX_IMAGES})` };
    }
    for (const u of imageUrls) {
      if (typeof u !== "string" || !u.startsWith("http")) {
        return { ok: false, error: "Invalid image URL" };
      }
    }
    return { ok: true };
  }

  static async createMessage(
    userId: string,
    userRole: UserRole,
    input: { body: string; imageUrls?: string[]; parentId?: string | null },
  ): Promise<{ ok: true; message: CommunityMessageDTO } | { ok: false; error: string; status?: number }> {
    const imageUrls = input.imageUrls ?? [];
    const v = CommunityService.validatePayload(input.body ?? "", imageUrls);
    if (!v.ok) return { ok: false, error: v.error, status: 400 };

    let parentId: string | null = input.parentId ?? null;
    if (parentId) {
      const parent = await db.communityMessage.findFirst({
        where: { id: parentId, channelId: CHANNEL },
      });
      if (!parent) {
        return { ok: false, error: "Thread not found", status: 404 };
      }
      if (parent.parentId !== null) {
        return { ok: false, error: "Reply to the main thread only", status: 400 };
      }
    }

    const text = input.body.trim();
    const row = await db.communityMessage.create({
      data: {
        channelId: CHANNEL,
        authorId: userId,
        body: text || (imageUrls.length ? "\u200b" : ""),
        imageUrls,
        parentId,
      },
      include: { author: { select: authorSelect } },
    });

    const dto = toDto({ ...row, _count: { replies: 0 } });

    const preview =
      text ||
      (imageUrls.length ? `${imageUrls.length} image(s)` : "");
    const base = env.frontendUrl.replace(/\/$/, "");
    void notifyCommunityPush({
      excludeUserId: userId,
      title: "TIC Community",
      body: `${row.author.firstName} ${row.author.lastName}: ${preview.slice(0, 120)}${preview.length > 120 ? "…" : ""}`,
      messageId: row.id,
      url: `${base}/fr/student/community`,
    }).catch((e) => logger.warn({ e }, "community push notify failed"));

    return { ok: true, message: dto };
  }

  static async setPinned(
    adminUserId: string,
    adminRole: UserRole,
    messageId: string,
    pinned: boolean,
  ): Promise<{ ok: true; message: CommunityMessageDTO } | { ok: false; error: string; status?: number }> {
    if (!CommunityService.isAdminRole(adminRole)) {
      return { ok: false, error: "Only administrators can pin messages", status: 403 };
    }

    const msg = await db.communityMessage.findFirst({
      where: { id: messageId, channelId: CHANNEL, parentId: null },
    });
    if (!msg) {
      return { ok: false, error: "Message not found or not a channel message", status: 404 };
    }

    const updated = await db.communityMessage.update({
      where: { id: messageId },
      data: {
        isPinned: pinned,
        pinnedAt: pinned ? new Date() : null,
        pinnedById: pinned ? adminUserId : null,
      },
      include: { author: { select: authorSelect }, _count: { select: { replies: true } } },
    });

    return { ok: true, message: toDto(updated) };
  }

  static async updateMessage(
    userId: string,
    messageId: string,
    input: { body: string; imageUrls?: string[] },
  ): Promise<{ ok: true; message: CommunityMessageDTO } | { ok: false; error: string; status?: number }> {
    const msg = await db.communityMessage.findFirst({
      where: { id: messageId, channelId: CHANNEL },
    });
    if (!msg) {
      return { ok: false, error: "Message not found", status: 404 };
    }
    if (msg.authorId !== userId) {
      return { ok: false, error: "You can only edit your own messages", status: 403 };
    }

    const imageUrls = input.imageUrls ?? msg.imageUrls;
    const v = CommunityService.validatePayload(input.body ?? "", imageUrls);
    if (!v.ok) return { ok: false, error: v.error, status: 400 };

    const text = input.body.trim();
    const updated = await db.communityMessage.update({
      where: { id: messageId },
      data: {
        body: text || (imageUrls.length ? "\u200b" : ""),
        imageUrls,
      },
      include: {
        author: { select: authorSelect },
        _count: { select: { replies: true } },
      },
    });

    return { ok: true, message: toDto(updated) };
  }

  static async deleteMessage(
    userId: string,
    userRole: UserRole,
    messageId: string,
  ): Promise<
    | { ok: true; deletedId: string; parentId: string | null }
    | { ok: false; error: string; status?: number }
  > {
    const msg = await db.communityMessage.findFirst({
      where: { id: messageId, channelId: CHANNEL },
    });
    if (!msg) {
      return { ok: false, error: "Message not found", status: 404 };
    }

    const isAdmin = CommunityService.isAdminRole(userRole);
    if (msg.authorId !== userId && !isAdmin) {
      return { ok: false, error: "You can only delete your own messages", status: 403 };
    }

    const parentId = msg.parentId;

    if (!parentId) {
      await db.communityMessage.deleteMany({ where: { parentId: msg.id } });
    }

    await db.communityMessage.delete({ where: { id: messageId } });

    return { ok: true, deletedId: messageId, parentId };
  }

  /**
   * Admin-only: delete many channel messages in one transaction.
   * For selected roots, all replies are removed first (including replies not selected).
   */
  static async bulkDeleteMessages(
    adminRole: UserRole,
    ids: string[],
  ): Promise<{ ok: true; deletedIds: string[] } | { ok: false; error: string; status?: number }> {
    if (!CommunityService.isAdminRole(adminRole)) {
      return { ok: false, error: "Only administrators can bulk delete", status: 403 };
    }
    const unique = [...new Set(ids)].filter((id) => typeof id === "string" && id.length > 0);
    if (unique.length === 0) {
      return { ok: true, deletedIds: [] };
    }
    if (unique.length > 150) {
      return { ok: false, error: "Too many messages (max 150 per request)", status: 400 };
    }

    const msgs = await db.communityMessage.findMany({
      where: { id: { in: unique }, channelId: CHANNEL },
      select: { id: true, parentId: true },
    });
    if (msgs.length !== unique.length) {
      return { ok: false, error: "One or more messages were not found", status: 400 };
    }

    const rootIds = msgs.filter((m) => !m.parentId).map((m) => m.id);

    await db.$transaction(async (tx) => {
      if (rootIds.length > 0) {
        await tx.communityMessage.deleteMany({
          where: { parentId: { in: rootIds } },
        });
      }
      await tx.communityMessage.deleteMany({
        where: { id: { in: unique } },
      });
    });

    return { ok: true, deletedIds: unique };
  }

  static async savePushSubscription(
    userId: string,
    sub: { endpoint: string; keys: { p256dh: string; auth: string } },
  ): Promise<void> {
    const existing = await db.pushSubscription.findFirst({
      where: { userId, endpoint: sub.endpoint },
    });
    if (existing) {
      await db.pushSubscription.update({
        where: { id: existing.id },
        data: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      });
    } else {
      await db.pushSubscription.create({
        data: {
          userId,
          endpoint: sub.endpoint,
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
      });
    }
  }

  static async removePushSubscription(userId: string, endpoint: string): Promise<void> {
    await db.pushSubscription.deleteMany({ where: { userId, endpoint } });
  }
}
