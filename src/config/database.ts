import { PrismaClient } from "@prisma/client";
import { env } from "./env";

// Initialize Prisma Client with proper configuration
export const db = new PrismaClient({
  log: env.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await db.$disconnect();
});


