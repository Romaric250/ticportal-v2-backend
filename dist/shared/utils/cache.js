import { redis } from "../../config/redis.js";
export const getCache = async (key) => {
    if (!redis)
        return null;
    return await redis.get(key);
};
export const setCache = async (key, value, ttl) => {
    if (!redis)
        return;
    if (ttl) {
        await redis.setex(key, ttl, value);
    }
    else {
        await redis.set(key, value);
    }
};
export const deleteCache = async (key) => {
    if (!redis)
        return;
    await redis.del(key);
};
//# sourceMappingURL=cache.js.map