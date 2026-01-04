import { redis } from "../../config/redis";
export const getCache = async (key) => {
    return await redis.get(key);
};
export const setCache = async (key, value, ttl) => {
    if (ttl) {
        await redis.setex(key, ttl, value);
    }
    else {
        await redis.set(key, value);
    }
};
export const deleteCache = async (key) => {
    await redis.del(key);
};
//# sourceMappingURL=cache.js.map