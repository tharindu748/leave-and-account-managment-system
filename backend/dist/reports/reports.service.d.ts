import { DatabaseService } from '../database/database.service';
export declare class ReportsService {
    private database;
    constructor(database: DatabaseService);
    getEmployeeDashboardData(userId: number): Promise<{
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
    private getMockData;
    private calculateWorkedDays;
    private getLeaveData;
    private getWorkHoursThisMonth;
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
