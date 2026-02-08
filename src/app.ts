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
import feedRoutes from "./modules/feed/routes";
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
import { startCronJobs } from './config/cron';
import badgeRoutes from "./modules/badges/routes";
import leaderboardRoutes from "./modules/leaderboard/routes";
import dashboardRoutes from "./modules/dashboard/routes";
import portfolioRoutes from "./modules/portfolio/routes";
import affiliateRoutes from "./modules/affiliate/routes";
import paymentRoutes from "./modules/payment/routes";

const app = express();


// Simplified logging middleware - log all requests and responses
app.use((req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  
  // Store request body
  const requestBody = req.body;
  
  // Override res.json to capture response
  res.json = function(body: any) {
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
  res.send = function(body: any) {
    const duration = Date.now() - startTime;
    let responseBody = body;
    
    try {
      responseBody = typeof body === 'string' ? JSON.parse(body) : body;
    } catch (e) {
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

// CORS configuration - must be before other middleware
const allowedOrigins = [
  env.clientUrl,
  "https://ticportal-v2.vercel.app",
  "http://localhost:3000",
  "https://portal.ticsummit.org"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Return false to reject, not an error
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Configure Helmet to not interfere with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(generalRateLimit);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Activity tracking middleware (tracks all authenticated requests)
app.use(trackActivity);

// Start all cron jobs (health check + badge awards)
startCronJobs();
logger.info("🤖 Cron jobs initialized");

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
app.use("/api", badgeRoutes); // Badge routes registered ✅
app.use("/api", leaderboardRoutes); // Leaderboard routes registered ✅
app.use("/api", dashboardRoutes); // Dashboard routes registered ✅
app.use("/api", portfolioRoutes); // Portfolio routes registered ✅
app.use("/api/affiliate", affiliateRoutes); // Affiliate routes registered ✅
app.use("/api/payment", paymentRoutes); // Payment routes registered ✅
logger.info("✅ Feed routes registered at /api/feed/*");
logger.info("✅ Badge routes registered at /api/badges/*");
logger.info("✅ Leaderboard routes registered at /api/leaderboard/*");
logger.info("✅ Dashboard routes registered at /api/dashboard/*");
logger.info("✅ Portfolio routes registered at /api/portfolio");
logger.info("✅ Affiliate routes registered at /api/affiliate");
logger.info("✅ Payment routes registered at /api/payment");
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
app.use((req, res) => {
  // Ensure CORS headers are set even on 404 responses
  const origin = req.headers.origin;
  const allowedOrigins = [
    env.clientUrl,
    "https://ticportal-v2.vercel.app",
    "http://localhost:3000",
    "https://portal.ticsummit.org"
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
      details: [],
    },
  });
});

// Handle OPTIONS requests explicitly for CORS preflight
app.options('*', cors());

// Basic error logger (full error middleware to be added later)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "Unhandled error");
    
    // Ensure CORS headers are set even on error responses
    const origin = _req.headers.origin;
    const allowedOrigins = [
      env.clientUrl,
      "https://ticportal-v2.vercel.app",
      "http://localhost:3000",
      "https://portal.ticsummit.org"
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
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

