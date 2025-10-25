import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
    getSummary(date: string): Promise<({
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
