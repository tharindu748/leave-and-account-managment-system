import { DatabaseService } from 'src/database/database.service';
import { CalculateAttendanceDto } from './dto/attendance.dto';
import { UpdateAttendanceConfigDto } from './dto/update-attendance-config.dto';
type GetMonthRecordsParams = {
    month: string;
    employeeIds?: string[];
    timezone: string;
};
type GetDaySnapshotParams = {
    date: string;
    employeeIds?: string[];
    timezone: string;
};
export declare class AttendanceService {
    private prisma;
    constructor(prisma: DatabaseService);
    findAttendanceDay(employeeId: string, workDate: string): Promise<{
        employeeId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        workDate: Date;
        startTime: string | null;
        firstIn: string | null;
        lastOut: string | null;
        workedSeconds: number;
        notWorkingSeconds: number;
        overtimeSeconds: number;
        hadManual: boolean;
        calculatedAt: Date;
    } | null>;
    findAllAttendanceUser(employeeId: string): Promise<{
        employeeId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        workDate: Date;
        startTime: string | null;
        firstIn: string | null;
        lastOut: string | null;
        workedSeconds: number;
        notWorkingSeconds: number;
        overtimeSeconds: number;
        hadManual: boolean;
        calculatedAt: Date;
    }[] | undefined>;
    getAttendanceConfig(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        workStart: Date;
        workEnd: Date;
        otEnd: Date;
        earlyStart: Date;
    }>;
    updateAttendanceConfig(dto: UpdateAttendanceConfigDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        workStart: Date;
        workEnd: Date;
        otEnd: Date;
        earlyStart: Date;
    }>;
    calculateAttendance(dto: CalculateAttendanceDto, persistNormalization?: boolean): Promise<{
        employeeId: string;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        workDate: Date;
        startTime: string | null;
        firstIn: string | null;
        lastOut: string | null;
        workedSeconds: number;
        notWorkingSeconds: number;
        overtimeSeconds: number;
        hadManual: boolean;
        calculatedAt: Date;
    }>;
    private normalizeSequence;
    private buildPeriods;
    private persistNormalizedDirections;
    private overlap;
    private clip;
    private ymd;
    recalcUserAllDays(employeeId: string, persistNormalization?: boolean): Promise<{
        employeeId: string;
        daysProcessed: number;
    }>;
    recalcAllUsersAllDays(persistNormalization?: boolean): Promise<{
        employeeId: string;
        daysProcessed: number;
    }[]>;
    private parseMonthRange;
    private parseDayRange;
    private dateKey;
    private buildMonthSkeleton;
    getMonthRecords(params: GetMonthRecordsParams): Promise<{
        month: string;
        timezone: string;
        employees: {
            id: string;
            name: string;
            records: {
                date: string;
                start: string | null;
                lastOut: string | null;
                workedSeconds: number;
                notWorkingSeconds: number;
                overtimeSeconds: number;
            }[];
        }[];
    }>;
    getDaySnapshot(params: GetDaySnapshotParams): Promise<{
        date: string;
        timezone: string;
        employees: {
            id: string;
            name: string;
            start: string | null;
            lastOut: string | null;
            workedSeconds: number;
            notWorkingSeconds: number;
            overtimeSeconds: number;
        }[];
    }>;
}
export {};
