import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./shared/utils/logger";
import { initializeSocket } from "./socket";
import { startNotificationCleanup } from "./jobs/notificationCleanup";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
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


