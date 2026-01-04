export declare class HackathonService {
    static getHackathons(): Promise<{
        id: string;
        name: string;
        level: import(".prisma/client").$Enums.HackathonLevel;
        status: import(".prisma/client").$Enums.HackathonStatus;
        startDate: Date;
        endDate: Date;
    }[]>;
}
//# sourceMappingURL=service.d.ts.map