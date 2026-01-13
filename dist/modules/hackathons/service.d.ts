export declare class HackathonService {
    static getHackathons(): Promise<{
        level: import(".prisma/client").$Enums.HackathonLevel;
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.HackathonStatus;
        startDate: Date;
        endDate: Date;
    }[]>;
}
//# sourceMappingURL=service.d.ts.map