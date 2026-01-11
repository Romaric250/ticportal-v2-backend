import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing";

// Export uploadthing route handler
export const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
});

// Export file upload helpers
export { uploadRouter } from "./uploadthing";