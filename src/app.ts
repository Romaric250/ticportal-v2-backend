import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/users/routes";
import squadRoutes from "./modules/squads/routes";
import teamRoutes from "./modules/teams/routes";
import hackathonRoutes from "./modules/hackathons/routes";
import { authenticate } from "./shared/middleware/auth";
import { generalRateLimit } from "./shared/middleware/rateLimit";

const app = express();

// HTTP request logger - simplified logging
app.use(
  pinoHttp({
    logger: logger,
    autoLogging: true,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      }
      return "info";
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} - ${res.statusCode} - Error: ${err?.message || "Unknown error"}`;
    },
  }),
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(helmet());
app.use(generalRateLimit);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/squads", squadRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);

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

export default app;


