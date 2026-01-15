/**
 * Migrate existing posts from imageUrl (single) to imageUrls (array)
 * Run this script once after updating the schema
 */
export declare function migrateImageUrlToImageUrls(): Promise<{
    success: boolean;
    total: number;
    migrated: number;
    skipped: number;
}>;
//# sourceMappingURL=migrate-images.d.ts.map