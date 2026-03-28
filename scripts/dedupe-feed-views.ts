/**
 * Removes duplicate FeedView rows (same postId + userId).
 * Keeps the row with the latest viewedAt per pair.
 *
 * Usage: npx tsx scripts/dedupe-feed-views.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.feedView.findMany({ orderBy: { viewedAt: "desc" } });
  const seen = new Set<string>();
  const idsToDelete: string[] = [];

  for (const row of rows) {
    const k = `${row.postId}:${row.userId}`;
    if (seen.has(k)) {
      idsToDelete.push(row.id);
    } else {
      seen.add(k);
    }
  }

  if (idsToDelete.length === 0) {
    console.log("No duplicate FeedView rows found.");
    return;
  }

  console.log(
    `Deleting ${idsToDelete.length} duplicate FeedView row(s) (keeping latest viewedAt per postId + userId)...`
  );

  const chunk = 100;
  for (let i = 0; i < idsToDelete.length; i += chunk) {
    const slice = idsToDelete.slice(i, i + chunk);
    const result = await prisma.feedView.deleteMany({ where: { id: { in: slice } } });
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
