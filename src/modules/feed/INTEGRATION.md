// Feed Module Integration Guide

/**
 * 1. Add to your main app.ts or index.ts:
 */

// Import feed routes
import feedRoutes from "./modules/feed/routes";

// Register routes
app.use("/api", feedRoutes);

/**
 * 2. Setup WebSocket in your socket.ts or wherever you initialize Socket.IO:
 */

import { Server } from "socket.io";
import { setupFeedSocket, FeedSocketEmitter } from "./modules/feed/socket";

// After creating your Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Initialize feed socket namespace
setupFeedSocket(io);

// Initialize socket emitter
FeedSocketEmitter.initialize(io);

/**
 * 3. Database Setup:
 */

// Run these commands:
// npx prisma generate
// npx prisma db push

/**
 * 4. Environment Variables:
 * Make sure you have CLIENT_URL in your .env file
 */

// .env
// CLIENT_URL=http://localhost:3000

/**
 * That's it! The feed module is now fully integrated.
 */
