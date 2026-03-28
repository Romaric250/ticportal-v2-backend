/**
 * Removes duplicate UserBadge rows (same userId + badgeId).
 * Run before `prisma db push` if index UserBadge_userId_badgeId_key fails with E11000.
 *
 * Usage: npx tsx scripts/dedupe-user-badges.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.userBadge.findMany({ orderBy: { earnedAt: "asc" } });
  const seen = new Set<string>();
  const idsToDelete: string[] = [];

  for (const row of rows) {
    const key = `${row.userId}:${row.badgeId}`;
    if (seen.has(key)) {
      idsToDelete.push(row.id);
    } else {
      seen.add(key);
    }
  }

  if (idsToDelete.length === 0) {
    console.log("No duplicate UserBadge rows found.");
    return;
  }

  console.log(`Deleting ${idsToDelete.length} duplicate UserBadge row(s) (keeping earliest earnedAt per pair)...`);

  const chunk = 100;
  for (let i = 0; i < idsToDelete.length; i += chunk) {
    const slice = idsToDelete.slice(i, i + chunk);
    const result = await prisma.userBadge.deleteMany({ where: { id: { in: slice } } });
    console.log(`  deleted ${result.count}`);
  }

  console.log("Done. You can run: npx prisma db push");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
