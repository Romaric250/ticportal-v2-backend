import dotenv from "dotenv";
dotenv.config();
export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
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
    emailFrom: process.env.EMAIL_FROM ?? "no-reply@ticsummit.org",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN ?? "",
};
// curl -X 'POST' \
//   'http://localhost:5000/api/auth/register' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "email": "romaric@ticsummit.org",
//   "password": "B2qh2699.",
//   "firstName": "Romaric",
//   "lastName": "Romaric",
//   "phone": "2376504954990",
//   "role": "STUDENT"
// }'
//# sourceMappingURL=env.js.map