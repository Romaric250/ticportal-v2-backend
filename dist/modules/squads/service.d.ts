export declare class SquadService {
    static getSquads(): Promise<{
        id: string;
        name: string;
        region: string;
        schoolName: string;
        area: string;
        status: import(".prisma/client").$Enums.SquadStatus;
    }[]>;
    static getSquadById(id: string): Promise<({
        members: {
            id: string;
            userId: string;
            role: import(".prisma/client").$Enums.SquadRole;
            squadId: string;
            joinedAt: Date;
        }[];
        teams: {
            id: string;
            name: string;
            createdAt: Date;
            squadId: string;
            projectTitle: string | null;
            description: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        region: string;
        schoolName: string;
        area: string;
        leadId: string;
        status: import(".prisma/client").$Enums.SquadStatus;
    }) | null>;
}
//# sourceMappingURL=service.d.ts.map