import webpush from "web-push";
import { db } from "../../config/database";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";

let configured = false;

function ensureVapid(): boolean {
  if (configured) return !!(env.vapidPublicKey && env.vapidPrivateKey);
  if (!env.vapidPublicKey || !env.vapidPrivateKey) {
    return false;
  }
  webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
  configured = true;
  return true;
}

export function isPushConfigured(): boolean {
  return !!(env.vapidPublicKey && env.vapidPrivateKey);
}

export function getVapidPublicKey(): string {
  return env.vapidPublicKey;
}

/**
 * Notify subscribers (except author) of a new community message — best-effort, no email.
 */
export async function notifyCommunityPush(params: {
  excludeUserId: string;
  title: string;
  body: string;
  messageId: string;
  /** Absolute URL for notification click */
  url?: string;
}): Promise<void> {
  if (!ensureVapid()) {
    return;
  }

  const subs = await db.pushSubscription.findMany({
    where: { userId: { not: params.excludeUserId } },
  });

  if (subs.length === 0) return;

  const payload = JSON.stringify({
    title: params.title,
    body: params.body.slice(0, 180),
    messageId: params.messageId,
    url: params.url ?? "/",
  });

  const chunk = 25;
  for (let i = 0; i < subs.length; i += chunk) {
    const batch = subs.slice(i, i + chunk);
    await Promise.all(
      batch.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload,
            { TTL: 3600 },
          );
        } catch (e: unknown) {
          const err = e as { statusCode?: number };
          if (err.statusCode === 404 || err.statusCode === 410) {
            await db.pushSubscription.deleteMany({ where: { id: s.id } }).catch(() => {});
          } else {
            logger.warn({ err: String(e), subId: s.id }, "web-push send failed");
          }
        }
      }),
    );
  }
}
