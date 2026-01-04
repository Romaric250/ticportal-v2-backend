/**
 * Validates a base64 image string
 * @param base64String The base64 string to validate
 * @returns True if valid, throws error if invalid
 */
export declare function validateBase64Image(base64String: string): boolean;
/**
 * Generates a filename for a profile photo
 * @param userId The user ID
 * @returns The generated filename
 */
export declare function generateProfilePhotoFilename(userId: string): string;
/**
 * Uploads a base64 image to UploadThing using UTApi
 * @param base64String The base64 image string
 * @param filename The filename to use
 * @returns The uploaded file URL
 */
export declare function uploadBase64ToUploadThing(base64String: string, filename: string): Promise<string>;
//# sourceMappingURL=uploadthing.d.ts.map