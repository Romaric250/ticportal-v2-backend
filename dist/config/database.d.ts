import { PrismaClient } from "@prisma/client";
/** Avoid logging every query in dev — it can slow large admin lists and flood I/O. */
export declare const db: PrismaClient<{
    log: ("error" | "warn")[];
}, "error" | "warn", import("@prisma/client/runtime/library").DefaultArgs>;
//# sourceMappingURL=database.d.ts.map