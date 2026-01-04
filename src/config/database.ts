import { PrismaClient } from "@prisma/client";
import { env } from "./env";

// Initialize Prisma Client for MongoDB
export const db = new PrismaClient({
  log: env.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await db.$disconnect();
});


