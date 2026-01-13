import Redis from "ioredis";
import { env } from "./env.js";
// Only connect to Redis if explicitly enabled
export const redis = env.isRedisActive
    ? new Redis(env.redisUrl)
    : null;
//# sourceMappingURL=redis.js.map