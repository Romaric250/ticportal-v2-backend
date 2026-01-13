/**
 * Uploadthing File Router
 * Define upload endpoints and permissions
 */
export declare const uploadRouter: {
    fileUpload: import("uploadthing/dist/types-Bs3w2d_3").FileRoute<{
        input: undefined;
        output: {
            uploadedBy: string;
        };
        errorShape: import("@uploadthing/shared").Json;
    }>;
};
export type OurFileRouter = typeof uploadRouter;
//# sourceMappingURL=uploadthing.d.ts.map