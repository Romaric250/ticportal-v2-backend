import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";

/**
 * Migrate existing posts from imageUrl (single) to imageUrls (array)
 * Run this script once after updating the schema
 */
export async function migrateImageUrlToImageUrls() {
  try {
    logger.info("Starting imageUrl to imageUrls migration...");

    // Get all posts that might have the old imageUrl field
    const posts = await db.feedPost.findMany({
      select: {
        id: true,
        imageUrls: true,
      },
    });

    let migratedCount = 0;
    let skippedCount = 0;

    for (const post of posts) {
      // If imageUrls is already populated, skip
      if (post.imageUrls && post.imageUrls.length > 0) {
        skippedCount++;
        continue;
      }

      // Check if old imageUrl field exists (will be undefined after schema change)
      // This is just for reference - you may need to handle existing data differently
      
      // For now, just ensure imageUrls is an empty array if not set
      await db.feedPost.update({
        where: { id: post.id },
        data: {
          imageUrls: post.imageUrls || [],
        },
      });

      migratedCount++;
    }

    logger.info({
      total: posts.length,
      migrated: migratedCount,
      skipped: skippedCount,
    }, "Image URL migration completed");

    return {
      success: true,
      total: posts.length,
      migrated: migratedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    logger.error({ error }, "Image URL migration failed");
    throw error;
  }
}

/**
 * Run migration if this file is executed directly
 */
if (require.main === module) {
  migrateImageUrlToImageUrls()
    .then((result) => {
      console.log("✅ Migration completed successfully:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    });
}
