import { PrismaClient } from "@prisma/client";
import { env } from "./env";
// Initialize Prisma Client for MongoDB
/** Avoid logging every query in dev — it can slow large admin lists and flood I/O. */
export const db = new PrismaClient({
    log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});
// Graceful shutdown
process.on("beforeExit", async () => {
    await db.$disconnect();
});
//# sourceMappingURL=database.js.map