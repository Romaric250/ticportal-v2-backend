import { getCache, setCache } from "../utils/cache.js";
export const cacheMiddleware = (ttl = 300) => {
    return async (req, res, next) => {
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
        res.json = (body) => {
            setCache(key, JSON.stringify(body), ttl);
            return originalJson.call(res, body);
        };
        next();
    };
};
//# sourceMappingURL=cache.js.map