import axios from "axios";
import { logger } from "../../shared/utils/logger.js";
const GDRIVE_FILE_PATTERNS = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /docs\.google\.com\/(?:document|spreadsheets|presentation|forms)\/d\/([a-zA-Z0-9_-]+)/,
];
const GDRIVE_FOLDER_PATTERN = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/;
/**
 * Extract a Google Drive file or folder ID from a URL.
 */
export function extractGDriveId(url) {
    if (!url)
        return { id: null, isFolder: false };
    const folderMatch = url.match(GDRIVE_FOLDER_PATTERN);
    if (folderMatch?.[1])
        return { id: folderMatch[1], isFolder: true };
    for (const pattern of GDRIVE_FILE_PATTERNS) {
        const match = url.match(pattern);
        if (match?.[1])
            return { id: match[1], isFolder: false };
    }
    return { id: null, isFolder: false };
}
export function isGoogleDriveUrl(url) {
    if (!url)
        return false;
    return /drive\.google\.com|docs\.google\.com/.test(url);
}
/**
 * Check if a Google Drive file/folder is publicly accessible.
 * Uses the Google Drive API v3 with an API key — public files return 200,
 * non-public files return 404 or 403.
 */
export async function checkGDriveAccess(url, apiKey) {
    if (!isGoogleDriveUrl(url)) {
        return { isGoogleDrive: false, fileId: null, isFolder: false, accessible: null };
    }
    const { id, isFolder } = extractGDriveId(url);
    if (!id) {
        return { isGoogleDrive: true, fileId: null, isFolder, accessible: null, error: "Could not extract file ID from URL" };
    }
    const key = apiKey || process.env.GOOGLE_API_KEY;
    if (!key) {
        return await checkGDriveAccessNoKey(id, isFolder, url);
    }
    try {
        const res = await axios.get(`https://www.googleapis.com/drive/v3/files/${id}`, {
            params: { key, fields: "name,shared" },
            timeout: 10000,
            validateStatus: () => true,
        });
        if (res.status === 200) {
            return { isGoogleDrive: true, fileId: id, isFolder, accessible: true };
        }
        return {
            isGoogleDrive: true,
            fileId: id,
            isFolder,
            accessible: false,
            error: res.status === 404
                ? "File not found or not publicly shared"
                : `Drive API returned ${res.status}`,
        };
    }
    catch (e) {
        logger.warn({ fileId: id, err: e.message }, "GDrive access check failed");
        return {
            isGoogleDrive: true,
            fileId: id,
            isFolder,
            accessible: null,
            error: e.message,
        };
    }
}
/**
 * Fallback: check access without an API key by making an unauthenticated
 * request to the Drive export/embed endpoint.
 */
async function checkGDriveAccessNoKey(id, isFolder, originalUrl) {
    try {
        const checkUrl = isFolder
            ? `https://drive.google.com/drive/folders/${id}`
            : `https://drive.google.com/file/d/${id}/view`;
        const res = await axios.get(checkUrl, {
            timeout: 15000,
            maxRedirects: 5,
            validateStatus: () => true,
            headers: { "User-Agent": "TICPortal-AccessChecker/1.0" },
        });
        if (res.status >= 400) {
            return { isGoogleDrive: true, fileId: id, isFolder, accessible: false, error: `HTTP ${res.status}` };
        }
        const html = typeof res.data === "string" ? res.data : "";
        const needsLogin = html.includes("accounts.google.com/ServiceLogin") ||
            html.includes("accounts.google.com/v3/signin") ||
            html.includes("Sign in - Google Accounts");
        return {
            isGoogleDrive: true,
            fileId: id,
            isFolder,
            accessible: !needsLogin,
            ...(needsLogin ? { error: "Requires Google sign-in (not publicly shared)" } : {}),
        };
    }
    catch (e) {
        return {
            isGoogleDrive: true,
            fileId: id,
            isFolder,
            accessible: null,
            error: e.message,
        };
    }
}
/**
 * Bulk-check multiple URLs. Returns a map of deliverableId → result.
 * Runs checks with concurrency limit to avoid hammering Google.
 */
export async function bulkCheckGDriveAccess(items, concurrency = 5) {
    const results = new Map();
    const queue = [...items];
    async function worker() {
        while (queue.length > 0) {
            const item = queue.shift();
            if (!item)
                break;
            const result = await checkGDriveAccess(item.url);
            results.set(item.id, result);
        }
    }
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
    await Promise.all(workers);
    return results;
}
//# sourceMappingURL=gdrive-checker.js.map