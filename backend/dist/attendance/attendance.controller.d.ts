import { AttendanceService } from './attendance.service';
import { CalculateAttendanceDto } from './dto/attendance.dto';
import { UpdateAttendanceConfigDto } from './dto/update-attendance-config.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    calculate(dto: CalculateAttendanceDto): Promise<{
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
    get(employeeId: string, workDate: string): Promise<{
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
    recalcUserAllDays(employeeId: string, persist?: string): Promise<{
        employeeId: string;
        daysProcessed: number;
    }>;
    recalcAllUsersAllDays(persist?: string): Promise<{
        employeeId: string;
        daysProcessed: number;
    }[]>;
    getConfig(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        workStart: Date;
        workEnd: Date;
        otEnd: Date;
        earlyStart: Date;
    }>;
    updateConfig(dto: UpdateAttendanceConfigDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        workStart: Date;
        workEnd: Date;
        otEnd: Date;
        earlyStart: Date;
    }>;
    getMonthlyRecords(month: string, employees?: string, tz?: string): Promise<{
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
    getDaySnapshot(date: string, employees?: string, tz?: string): Promise<{
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
