export declare class SquadService {
    static getSquads(): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.SquadStatus;
        region: string;
        schoolName: string;
        area: string;
    }[]>;
    static getSquadById(id: string): Promise<({
        members: {
            userId: string;
            id: string;
            role: import(".prisma/client").$Enums.SquadRole;
            squadId: string;
            joinedAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.SquadStatus;
        region: string;
        schoolName: string;
        area: string;
        leadId: string;
    }) | null>;
}
//# sourceMappingURL=service.d.ts.map