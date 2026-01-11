import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import { initializeSocket } from "./socket";
import { startNotificationCleanup } from "./jobs/notificationCleanup";
import { Router } from "express";
import uploadRoutes from "./modules/upload/routes";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import multer from "multer";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

// Configure multer for global file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize Socket.io with authentication and event handlers
initializeSocket(io);
startNotificationCleanup();

const port = env.port;

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  logger.info(`http://localhost:${port}`)
});

export { io };

const router = Router();

// Global file upload endpoint (before other routes)
app.post("/api/f/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // File URL from uploadthing or multer
    const fileUrl = (file as any).url || `https://uploadthing.com/f/${file.filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
});

// Mount routes
app.use("/api/auth", authRoutes);
// ...existing route mounts...
app.use("/api/f", uploadRoutes); // Global file upload

export default router;


