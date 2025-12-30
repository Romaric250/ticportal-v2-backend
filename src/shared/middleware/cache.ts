import type { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "../utils/cache";

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      return next();
    }
    const key = `cache:${req.originalUrl}`;
    const cached = await getCache(key);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }
    const originalJson = res.json;
    res.json = (body: any) => {
      setCache(key, JSON.stringify(body), ttl);
      return originalJson.call(res, body);
    };
    next();
  };
};