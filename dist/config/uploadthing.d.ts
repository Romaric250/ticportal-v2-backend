/**
 * UploadThing FileRouter
 * Defines the file upload routes and their configurations
 */
export declare const uploadRouter: {
    profilePhotoUploader: import("uploadthing/dist/types-Bs3w2d_3").FileRoute<{
        input: undefined;
        output: {
            success: boolean;
        };
        errorShape: import("@uploadthing/shared").Json;
    }>;
};
export type OurFileRouter = typeof uploadRouter;
//# sourceMappingURL=uploadthing.d.ts.map