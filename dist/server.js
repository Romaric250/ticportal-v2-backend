import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";
import { initializeSocket } from "./socket/index.js";
import { startNotificationCleanup } from "./jobs/notificationCleanup.js";
import { startCommissionProcessor } from "./jobs/commissionProcessor.js";
import { startBadgeProcessor } from "./jobs/badgeProcessor.js";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            env.clientUrl,
            "https://ticportal-v2.vercel.app",
            "http://localhost:3000",
            "https://portal.ticsummit.org"
        ],
        credentials: true,
    },
});
// Initialize Socket.io with authentication and event handlers
initializeSocket(io);
startNotificationCleanup();
startCommissionProcessor();
startBadgeProcessor();
const port = env.port;
server.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
    logger.info(`http://localhost:${port}`);
});
export { io };
//# sourceMappingURL=server.js.map