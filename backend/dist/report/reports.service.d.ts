import { DatabaseService } from 'src/database/database.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    getMostLateEmployees(): Promise<{
        name: string;
        late: number;
        workingDays: number;
    }[]>;
    getLeastLateEmployees(): Promise<{
        name: string;
        late: number;
        workingDays: number;
    }[]>;
    getSummary(date: Date): Promise<({
        title: string;
        count: number;
        percentage: number;
        color?: undefined;
    } | {
        title: string;
        count: number;
        percentage: number;
        color: string;
    })[]>;
}
