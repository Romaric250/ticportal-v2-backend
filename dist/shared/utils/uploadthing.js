import { env } from "../../config/env";
import { logger } from "./logger";
import { UTApi } from "uploadthing/server";
// Initialize UTApi with your token
const utapi = new UTApi({ token: env.UPLOADTHING_TOKEN });
/**
 * Validates a base64 image string
 * @param base64String The base64 string to validate
 * @returns True if valid, throws error if invalid
 */
export function validateBase64Image(base64String) {
    // Check if string is empty
    if (!base64String || base64String.trim() === "") {
        throw new Error("Base64 string is empty");
    }
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    // Check if it's valid base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(base64Data)) {
        throw new Error("Invalid base64 format");
    }
    // Decode and check size (max 4MB)
    const buffer = Buffer.from(base64Data, "base64");
    const sizeInMB = buffer.length / (1024 * 1024);
    if (sizeInMB > 4) {
        throw new Error(`Image size (${sizeInMB.toFixed(2)}MB) exceeds 4MB limit`);
    }
    // Check if it's actually an image by checking magic bytes
    const magicBytes = buffer.slice(0, 4).toString("hex");
    const validImageTypes = [
        "89504e47", // PNG
        "ffd8ffe0", // JPEG
        "ffd8ffe1", // JPEG
        "ffd8ffe2", // JPEG
        "ffd8ffe8", // JPEG
        "47494638", // GIF
    ];
    const isValidImage = validImageTypes.some((type) => magicBytes.startsWith(type));
    if (!isValidImage) {
        throw new Error("Invalid image format. Only PNG, JPEG, and GIF are allowed");
    }
    return true;
}
/**
 * Generates a filename for a profile photo
 * @param userId The user ID
 * @returns The generated filename
 */
export function generateProfilePhotoFilename(userId) {
    const timestamp = Date.now();
    return `profile-${userId}-${timestamp}.jpg`;
}
/**
 * Uploads a base64 image to UploadThing using UTApi
 * @param base64String The base64 image string
 * @param filename The filename to use
 * @returns The uploaded file URL
 */
export async function uploadBase64ToUploadThing(base64String, filename) {
    try {
        // Validate the image
        validateBase64Image(base64String);
        logger.info({ filename }, "Starting UploadThing upload");
        // Remove data URL prefix if present
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        // Convert to buffer
        const buffer = Buffer.from(base64Data, "base64");
        logger.info({ filename, size: buffer.length }, "Image converted to buffer");
        // Determine content type from magic bytes
        const magicBytes = buffer.slice(0, 4).toString("hex");
        let contentType = "image/jpeg";
        if (magicBytes.startsWith("89504e47")) {
            contentType = "image/png";
        }
        else if (magicBytes.startsWith("47494638")) {
            contentType = "image/gif";
        }
        logger.info({ filename, contentType }, "Uploading to UploadThing via UTApi");
        // Create a File from the buffer using the UTApi
        const file = new File([buffer], filename, { type: contentType });
        // Upload using UTApi
        const response = await utapi.uploadFiles(file);
        logger.info({ filename, response }, "UploadThing response received");
        if (response.error) {
            logger.error({ error: response.error, filename }, "UploadThing upload failed");
            throw new Error(`Upload failed: ${response.error.message}`);
        }
        if (!response.data?.url) {
            logger.error({ filename, response }, "No URL in UploadThing response");
            throw new Error("No URL returned from UploadThing");
        }
        logger.info({ filename, url: response.data.url }, "Successfully uploaded to UploadThing");
        return response.data.url;
    }
    catch (error) {
        logger.error({ error, filename }, "Failed to upload to UploadThing");
        throw error;
    }
}
//# sourceMappingURL=uploadthing.js.map