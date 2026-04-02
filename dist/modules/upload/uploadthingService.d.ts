/**
 * Upload one file to UploadThing (server-side UTApi).
 * Uses `uploadFiles([file])` so the return shape is always an array of rows.
 *
 * Patches under `patches/` fix upstream bugs in `uploadthing` / `@uploadthing/shared`
 * (applied on `npm install` via patch-package); this module stays TypeScript only.
 */
export declare function uploadBufferWithUploadThing(opts: {
    buffer: Buffer;
    /** ASCII-safe name avoids ingest URL signing issues */
    filename: string;
    mimeType: string;
}): Promise<{
    url: string;
    key: string;
    name: string;
    size: number;
}>;
//# sourceMappingURL=uploadthingService.d.ts.map