export declare const env: {
    nodeEnv: string;
    /** Set true when the app sits behind a reverse proxy (e.g. Caddy/Nginx) so req.ip and rate limits use X-Forwarded-For. */
    trustProxy: boolean;
    port: number;
    isRateLimitActive: boolean;
    isRedisActive: boolean;
    isKafkaActive: boolean;
    DATABASE_URL: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    jwtAccessExpiresIn: string;
    jwtRefreshExpiresIn: string;
    redisUrl: string;
    kafkaBrokers: string[];
    clientUrl: string;
    frontendUrl: string;
    emailFrom: string;
    resendApiKey: string;
    /** Strip quotes / BOM — bad bytes break token JSON + HMAC on ingest ("Expired signature") */
    uploadthingToken: string;
    fapshiApiKey: string;
    fapshiApiUser: string;
    fapshiBaseUrl: string;
    fapshiWebhookSecret: string;
    googleApiKey: string;
    /** Web Push (VAPID) — optional; push endpoints noop if unset */
    vapidPublicKey: string;
    vapidPrivateKey: string;
    vapidSubject: string;
};
//# sourceMappingURL=env.d.ts.map