import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";
// Initialize Prisma Client for MongoDB
export const db = new PrismaClient({
    log: env.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
});
// Graceful shutdown
process.on("beforeExit", async () => {
    await db.$disconnect();
});
//# sourceMappingURL=database.js.map