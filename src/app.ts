import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { createRouteHandler } from "uploadthing/express";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import { trackActivity } from "./shared/middleware/activityTracker";
import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/users/routes";
import squadRoutes from "./modules/squads/routes";
import teamRoutes from "./modules/teams/routes";
import hackathonRoutes from "./modules/hackathons/routes";
import defaultsRoutes from "./modules/defaults/routes";
import notificationRoutes from "./modules/notifications/routes";
import adminRoutes from "./modules/admin/routes";
import { authenticate } from "./shared/middleware/auth";
import { generalRateLimit } from "./shared/middleware/rateLimit";
import { uploadRouter } from "./config/uploadthing";
import deliverableRoutes from "./modules/deliverables/routes";
import learningPathRoutes from "./modules/learning-paths/routes";
// import submissionRoutes from "./modules/submission/routes"; // REMOVED - doesn't exist
import uploadRoutes from "./modules/upload/routes";

const app = express();

// Simplified logging middleware - only log errors
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  
  // Store request body
  const requestBody = req.body;
  
  // Override res.json to capture response
  res.json = function(body: any) {
    if (res.statusCode >= 400) {
      logger.warn({
        url: `${req.method} ${req.url}`,
        body: requestBody,
        response: body,
        statusCode: res.statusCode,
      });
    }
    return originalJson(body);
  };
  
  // Override res.send to capture response
  res.send = function(body: any) {
    if (res.statusCode >= 400) {
      let responseBody = body;
      try {
        responseBody = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (e) {
        // If not JSON, use as is
      }
      logger.warn({
        url: `${req.method} ${req.url}`,
        body: requestBody,
        response: responseBody,
        statusCode: res.statusCode,
      });
    }
    return originalSend(body);
  };
  
  next();
});

app.use(
  cors({
    origin: [env.clientUrl, "https://ticportal-v2.vercel.app"],
    credentials: true,
  }),
);
app.use(helmet());
app.use(generalRateLimit);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Activity tracking middleware (tracks all authenticated requests)
app.use(trackActivity);

// Basic health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/defaults", defaultsRoutes);

// UploadThing route
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  }),
);

app.use("/api/users", authenticate, userRoutes);
app.use("/api/squads", squadRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", deliverableRoutes);
app.use("/api", learningPathRoutes);
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
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        details: [],
      },
    });
  },
);

// Don't listen here - server.ts handles listening
// const PORT = env.port || 5000;
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${env.port}`);
// });

export default app;


