import { env } from "../../config/env";
import { logger } from "./logger";

const UPLOADTHING_API_URL = "https://api.uploadthing.com/v6";

interface UploadThingResponse {
  data: {
    url: string;
    key: string;
    name: string;
    size: number;
  };
}

/**
 * Validates a base64 image string
 * @param base64String The base64 string to validate
 * @returns True if valid, throws error if invalid
 */
export function validateBase64Image(base64String: string): boolean {
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
    "47494638", // GIF
  ];

  const isValidImage = validImageTypes.some((type) =>
    magicBytes.startsWith(type),
  );

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
export function generateProfilePhotoFilename(userId: string): string {
  const timestamp = Date.now();
  return `profile-${userId}-${timestamp}.jpg`;
}

/**
 * Uploads a base64 image to UploadThing
 * @param base64String The base64 image string
 * @param filename The filename to use
 * @returns The uploaded file URL
 */
export async function uploadBase64ToUploadThing(
  base64String: string,
  filename: string,
): Promise<string> {
  try {
    // Validate the image
    validateBase64Image(base64String);

    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Create form data
    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("files", blob, filename);

    // Upload to UploadThing
    const response = await fetch(`${UPLOADTHING_API_URL}/uploadFiles`, {
      method: "POST",
      headers: {
        "X-Uploadthing-Api-Key": env.UPLOADTHING_TOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        { status: response.status, error: errorText },
        "UploadThing upload failed",
      );
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = (await response.json()) as UploadThingResponse;

    if (!result.data?.url) {
      throw new Error("No URL returned from UploadThing");
    }

    logger.info(
      { filename, url: result.data.url },
      "Successfully uploaded to UploadThing",
    );

    return result.data.url;
  } catch (error) {
    logger.error({ error, filename }, "Failed to upload to UploadThing");
    throw error;
  }
}
