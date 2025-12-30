import { redis } from "../../config/redis";

export const getCache = async (key: string): Promise<string | null> => {
  return await redis.get(key);
};

export const setCache = async (key: string, value: string, ttl?: number): Promise<void> => {
  if (ttl) {
    await redis.setex(key, ttl, value);
  } else {
    await redis.set(key, value);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  await redis.del(key);
};