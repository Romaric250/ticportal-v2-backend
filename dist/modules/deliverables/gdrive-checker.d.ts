export type GDriveCheckResult = {
    isGoogleDrive: boolean;
    fileId: string | null;
    isFolder: boolean;
    accessible: boolean | null;
    error?: string;
};
/**
 * Extract a Google Drive file or folder ID from a URL.
 */
export declare function extractGDriveId(url: string): {
    id: string | null;
    isFolder: boolean;
};
export declare function isGoogleDriveUrl(url: string): boolean;
/**
 * Check if a Google Drive file/folder is publicly accessible.
 * Uses the Google Drive API v3 with an API key — public files return 200,
 * non-public files return 404 or 403.
 */
export declare function checkGDriveAccess(url: string, apiKey?: string): Promise<GDriveCheckResult>;
/**
 * Bulk-check multiple URLs. Returns a map of deliverableId → result.
 * Runs checks with concurrency limit to avoid hammering Google.
 */
export declare function bulkCheckGDriveAccess(items: {
    id: string;
    url: string;
}[], concurrency?: number): Promise<Map<string, GDriveCheckResult>>;
//# sourceMappingURL=gdrive-checker.d.ts.map