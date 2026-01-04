import { verifyAccessToken } from "../utils/jwt";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: { message: "Unauthorized" } });
    }
    const token = authHeader.substring(7);
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, error: { message: "Invalid token" } });
    }
};
//# sourceMappingURL=auth.js.map