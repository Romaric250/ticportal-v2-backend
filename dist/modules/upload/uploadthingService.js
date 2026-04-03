import { UTApi } from "uploadthing/server";
import { env } from "../../config/env";
let utapiSingleton = null;
/** Effect's client passes a `URL` to fetch; normalize to `href` so the wire URL matches signed bytes. */
function uploadThingFetch(input, init) {
    const url = typeof input === "string"
        ? input
        : input instanceof URL
            ? input.href
            : input instanceof Request
                ? input.url
                : String(input);
    return globalThis.fetch(url, init);
}
function getUtapi() {
    if (!utapiSingleton) {
        utapiSingleton = new UTApi({
            token: env.uploadthingToken,
            fetch: uploadThingFetch,
        });
    }
    return utapiSingleton;
}
/**
 * Upload one file to UploadThing (server-side UTApi).
 * Uses `uploadFiles([file])` so the return shape is always an array of rows.
 *
 * Patches under `patches/` fix upstream bugs in `uploadthing` / `@uploadthing/shared`
 * (applied on `npm install` via patch-package); this module stays TypeScript only.
 */
export async function uploadBufferWithUploadThing(opts) {
    const ab = opts.buffer.buffer.slice(opts.buffer.byteOffset, opts.buffer.byteOffset + opts.buffer.byteLength);
    const file = new File([ab], opts.filename, {
        type: opts.mimeType || "application/octet-stream",
    });
    const utapi = getUtapi();
    const rows = (await utapi.uploadFiles([file]));
    const row = rows[0];
    if (!row) {
        throw new Error("Upload did not return a result");
    }
    if (row.error) {
        const err = row.error;
        const msg = err && typeof err === "object" && "message" in err
            ? String(err.message)
            : "Upload failed";
        throw new Error(msg);
    }
    const d = row.data;
    if (!d) {
        throw new Error("Upload returned no data");
    }
    const url = d.ufsUrl ?? d.url;
    if (!url) {
        throw new Error("Upload response had no file URL");
    }
    return {
        url,
        key: d.key,
        name: d.name,
        size: d.size,
    };
}
//# sourceMappingURL=uploadthingService.js.map