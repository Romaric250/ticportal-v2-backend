import { createUploadthing, type FileRouter } from "uploadthing/express";
import { logger } from "../shared/utils/logger";

const f = createUploadthing();

/**
 * UploadThing FileRouter
 * Defines the file upload routes and their configurations
 */
export const uploadRouter = {
  // Profile photo uploader
  profilePhotoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    logger.info({ data }, "Profile photo upload completed");
    return { success: true };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
