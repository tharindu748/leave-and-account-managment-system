import { DatabaseService } from 'src/database/database.service';
type SummaryParams = {
    start?: string;
    end?: string;
    employeeId?: string;
};
type TopParams = {
    start?: string;
    end?: string;
    limit?: number;
};
type SummaryRow = {
    id: number;
    name: string;
    late: number;
    workingDays: number;
};
export declare class AnalyticService {
    private readonly database;
    constructor(database: DatabaseService);
    getEmployeeWorkSummary(params: SummaryParams): Promise<SummaryRow[]>;
    getMostLateEmployees(params: TopParams): Promise<SummaryRow[]>;
    getLeastLateEmployees(params: TopParams): Promise<SummaryRow[]>;
    private parseClockStringToSeconds;
    private timeOfDayToSeconds;
    private resolveDateRange;
    getDailySummary(dateStr: string): Promise<{
        title: string;
        percentage: number;
        count: number;
    }[]>;
    private applyTimeOfDay;
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
export {};
