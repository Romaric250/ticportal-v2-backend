import dotenv from "dotenv";
dotenv.config();
export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    /** Set true when the app sits behind a reverse proxy (e.g. Caddy/Nginx) so req.ip and rate limits use X-Forwarded-For. */
    trustProxy: process.env.TRUST_PROXY === "true",
    port: Number(process.env.PORT ?? 5000),
    isRateLimitActive: process.env.IS_RATE_LIMIT_ACTIVE === "true",
    isRedisActive: process.env.IS_REDIS_ACTIVE === "true",
    isKafkaActive: process.env.IS_KAFKA_ACTIVE === "true",
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    redisUrl: process.env.REDIS_URL ?? "",
    kafkaBrokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(","),
    clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
    frontendUrl: process.env.FRONTEND_URL ?? process.env.CLIENT_URL ?? "http://localhost:3000",
    emailFrom: process.env.EMAIL_FROM ?? "no-reply@ticsummit.org",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    /** Strip quotes / BOM — bad bytes break token JSON + HMAC on ingest ("Expired signature") */
    uploadthingToken: (() => {
        let t = (process.env.UPLOADTHING_TOKEN ?? "").trim().replace(/^\uFEFF/, "");
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
            t = t.slice(1, -1).trim();
        }
        return t;
    })(),
    // Fapshi Payment Gateway
    fapshiApiKey: process.env.FAPSHI_API_KEY ?? "",
    fapshiApiUser: process.env.FAPSHI_API_USER ?? "",
    fapshiBaseUrl: process.env.FAPSHI_BASE_URL ?? "https://sandbox.fapshi.com",
    fapshiWebhookSecret: process.env.FAPSHI_WEBHOOK_SECRET ?? "",
    // Google Drive API (for checking public access on deliverable links)
    googleApiKey: process.env.GOOGLE_API_KEY ?? "",
    /** Web Push (VAPID) — optional; push endpoints noop if unset */
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? "",
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
    vapidSubject: process.env.VAPID_SUBJECT ?? "mailto:hello@ticsummit.org",
};
//# sourceMappingURL=env.js.map