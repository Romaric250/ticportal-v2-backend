import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

/**
 * Uploadthing File Router
 * Define upload endpoints and permissions
 */
export const uploadRouter = {
  // Generic file upload - accepts any file (8MB max per uploadthing limits)
  fileUpload: f({
    image: { maxFileSize: "8MB" },
    video: { maxFileSize: "8MB" },
    audio: { maxFileSize: "8MB" },
    pdf: { maxFileSize: "8MB" },
    text: { maxFileSize: "8MB" },
    blob: { maxFileSize: "8MB" },
  })
    .middleware(async () => {
      // Add authentication check here if needed
      // const user = await auth(req);
      // if (!user) throw new Error("Unauthorized");
      
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file.name);
      console.log("File URL:", file.url);
      
      return { uploadedBy: "system" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
