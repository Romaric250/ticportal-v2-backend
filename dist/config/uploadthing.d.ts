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
    /** UploadThing only allows power-of-two sizes (8MB, 16MB, …); 16MB covers the prior ~12MB cap. */
    generalUploader: import("uploadthing/dist/types-Bs3w2d_3").FileRoute<{
        input: undefined;
        output: {
            url: string;
        };
        errorShape: import("@uploadthing/shared").Json;
    }>;
};
export type OurFileRouter = typeof uploadRouter;
//# sourceMappingURL=uploadthing.d.ts.map