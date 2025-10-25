import { AnalyticService } from './analytic.service';
export declare class AnalyticController {
    private readonly analyticService;
    constructor(analyticService: AnalyticService);
    getAttendanceSummary(start?: string, end?: string, employeeId?: string): Promise<{
        id: number;
        name: string;
        late: number;
        workingDays: number;
    }[]>;
    getMostLateEmployees(start?: string, end?: string, limit?: string): Promise<{
        id: number;
        name: string;
        late: number;
        workingDays: number;
    }[]>;
    getLeastLateEmployees(start?: string, end?: string, limit?: string): Promise<{
        id: number;
        name: string;
        late: number;
        workingDays: number;
    }[]>;
    getSummary(date?: string): Promise<{
        title: string;
        percentage: number;
        count: number;
    }[]>;
    getEmployeeDashboardData(employeeId: string): Promise<{
        id: number;
        name: string;
        email: string;
        epfNo: string | null;
        position: string | null;
        image: string | null;
        workedSinceJoining: number;
        totalLeaveCount: number;
        leaveTaken: {
            sick: number;
            annual: number;
        };
        leaveBalances: {
            annual: number;
            casual: number;
        };
        remainingHolidays: number;
        workHoursThisMonth: number;
    }>;
}
