import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { createRouteHandler } from "uploadthing/express";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";
import { trackActivity } from "./shared/middleware/activityTracker.js";
import authRoutes from "./modules/auth/routes.js";
import userRoutes from "./modules/users/routes.js";
import squadRoutes from "./modules/squads/routes.js";
import feedRoutes from "./modules/feed/routes.js";
import teamRoutes from "./modules/teams/routes.js";
import hackathonRoutes from "./modules/hackathons/routes.js";
import defaultsRoutes from "./modules/defaults/routes.js";
import notificationRoutes from "./modules/notifications/routes.js";
import adminRoutes from "./modules/admin/routes.js";
import { authenticate } from "./shared/middleware/auth.js";
import { generalRateLimit } from "./shared/middleware/rateLimit.js";
import { uploadRouter } from "./config/uploadthing.js";
import deliverableRoutes from "./modules/deliverables/routes.js";
import learningPathRoutes from "./modules/learning-paths/routes.js";
// import submissionRoutes from "./modules/submission/routes.js"; // REMOVED - doesn't exist
import uploadRoutes from "./modules/upload/routes.js";
import job from "./config/cron.js";
const app = express();
// Simplified logging middleware - log all requests and responses
app.use((req, res, next) => {
    const startTime = Date.now();
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    // Store request body
    const requestBody = req.body;
    // Override res.json to capture response
    res.json = function (body) {
        const duration = Date.now() - startTime;
        logger.info({
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            requestBody,
            response: body,
        }, `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        return originalJson(body);
    };
    // Override res.send to capture response
    res.send = function (body) {
        const duration = Date.now() - startTime;
        let responseBody = body;
        try {
            responseBody = typeof body === 'string' ? JSON.parse(body) : body;
        }
        catch (e) {
            // If not JSON, use as is
            responseBody = body;
        }
        logger.info({
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            requestBody,
            response: responseBody,
        }, `${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        return originalSend(body);
    };
    next();
});
app.use(cors({
    origin: [env.clientUrl, "https://ticportal-v2.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use(helmet());
app.use(generalRateLimit);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// Activity tracking middleware (tracks all authenticated requests)
app.use(trackActivity);
job.start();
// Basic health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
// API routes
app.use("/api/auth", authRoutes);
app.use("/api/defaults", defaultsRoutes);
// UploadThing route
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
}));
app.use("/api/users", authenticate, userRoutes);
app.use("/api/squads", squadRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", deliverableRoutes);
app.use("/api", learningPathRoutes);
// Debug middleware for feed routes
app.use("/api/feed", (req, res, next) => {
    logger.info({
        feedRoute: true,
        method: req.method,
        path: req.path,
        fullUrl: req.originalUrl,
        body: req.body,
        headers: {
            authorization: req.headers.authorization ? "Present" : "Missing",
            contentType: req.headers["content-type"],
        },
    }, `🔥 Feed route hit: ${req.method} ${req.originalUrl}`);
    next();
});
app.use("/api", feedRoutes); // Feed routes registered ✅
logger.info("✅ Feed routes registered at /api/feed/*");
logger.info("Feed routes available:");
logger.info("  POST   /api/feed/posts");
logger.info("  GET    /api/feed/posts");
logger.info("  GET    /api/feed/posts/:postId");
logger.info("  PUT    /api/feed/posts/:postId");
logger.info("  DELETE /api/feed/posts/:postId");
logger.info("  POST   /api/feed/posts/:postId/like");
logger.info("  POST   /api/feed/posts/:postId/bookmark");
logger.info("  POST   /api/feed/posts/:postId/view");
logger.info("  GET    /api/feed/posts/:postId/comments");
logger.info("  POST   /api/feed/posts/:postId/comments");
logger.info("  GET    /api/feed/bookmarks");
logger.info("  GET    /api/feed/trending-tags");
// app.use("/api/submissions", submissionRoutes); // REMOVED - doesn't exist
app.use("/api/f", uploadRoutes); // Global file upload
// Swagger setup
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TIC Summit Portal V2 API",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/modules/**/*.ts"], // Include route files
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Global 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Route not found",
            details: [],
        },
    });
});
// Basic error logger (full error middleware to be added later)
app.use(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(err, _req, res, _next) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
            details: [],
        },
    });
});
// Don't listen here - server.ts handles listening
// const PORT = env.port || 5000;
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${env.port}`);
// });
export default app;
//# sourceMappingURL=app.js.map