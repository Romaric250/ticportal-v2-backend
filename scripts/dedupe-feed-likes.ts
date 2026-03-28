/**
 * Removes duplicate FeedLike rows (same postId + commentId + userId).
 * Run before `prisma db push` if feed_likes index fails with E11000.
 *
 * Usage: npx tsx scripts/dedupe-feed-likes.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function key(row: { postId: string | null; commentId: string | null; userId: string }) {
  return `${row.postId ?? ""}\t${row.commentId ?? ""}\t${row.userId}`;
}

async function main() {
  const rows = await prisma.feedLike.findMany({ orderBy: { createdAt: "asc" } });
  const seen = new Set<string>();
  const idsToDelete: string[] = [];

  for (const row of rows) {
    const k = key(row);
    if (seen.has(k)) {
      idsToDelete.push(row.id);
    } else {
      seen.add(k);
    }
  }

  if (idsToDelete.length === 0) {
    console.log("No duplicate FeedLike rows found.");
    return;
  }

  console.log(`Deleting ${idsToDelete.length} duplicate FeedLike row(s) (keeping earliest createdAt per triple)...`);

  const chunk = 100;
  for (let i = 0; i < idsToDelete.length; i += chunk) {
    const slice = idsToDelete.slice(i, i + chunk);
    const result = await prisma.feedLike.deleteMany({ where: { id: { in: slice } } });
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
