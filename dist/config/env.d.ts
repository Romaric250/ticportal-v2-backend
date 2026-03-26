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
    UPLOADTHING_TOKEN: string;
    fapshiApiKey: string;
    fapshiApiUser: string;
    fapshiBaseUrl: string;
    fapshiWebhookSecret: string;
};
//# sourceMappingURL=env.d.ts.map