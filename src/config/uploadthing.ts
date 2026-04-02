import { createUploadthing, type FileRouter } from "uploadthing/express";
import { logger } from "../shared/utils/logger";

const f = createUploadthing();

/**
 * UploadThing FileRouter
 * Defines the file upload routes and their configurations
 */
export const uploadRouter = {
  profilePhotoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    logger.info({ data }, "Profile photo upload completed");
    return { success: true };
  }),

  /** UploadThing only allows power-of-two sizes (8MB, 16MB, …); 16MB covers the prior ~12MB cap. */
  generalUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    video: { maxFileSize: "16MB", maxFileCount: 2 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
    blob: { maxFileSize: "16MB", maxFileCount: 5 },
  }).onUploadComplete((data) => {
    logger.info({ key: data.file.key, name: data.file.name }, "File upload completed");
    return { url: data.file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
