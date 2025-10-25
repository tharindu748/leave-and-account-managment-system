import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getEmployeeDashboard(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        position: string;
        epfNo: string;
        image: string | null;
        workedSinceJoining: number;
        totalLeaveCount: number;
        leaveTaken: {
            sick: number;
            annual: number;
        };
        remainingHolidays: number;
        workHoursThisMonth: number;
    }>;
}
