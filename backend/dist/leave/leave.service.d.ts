import { DatabaseService } from 'src/database/database.service';
import { CreateLeaveRequestDto } from './dto/create_leave_request.dto';
import { LeaveType } from '@prisma/client';
import { ApproveLeaveRequestDto } from './dto/approve_leave_request.dto';
import { CancelLeaveRequestDto } from './dto/cancel_leave_request.dto';
export declare class LeaveService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    private getOrInitializeBalance;
    createLeaveRequest(data: CreateLeaveRequestDto): Promise<{
        user: {
            name: string;
            jobPosition: string | null;
            email: string;
            id: number;
        };
        dates: {
            id: number;
            isHalfDay: boolean;
            requestId: number;
            leaveDate: Date;
            halfdayType: import("@prisma/client").$Enums.HalfdayType | null;
        }[];
    } & {
        id: number;
        userId: number;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        reason: string | null;
        approvedBy: number | null;
        status: import("@prisma/client").$Enums.LeaveStatus | null;
        requestedAt: Date;
        approvedAt: Date | null;
        rejectedAt: Date | null;
    }>;
    getCalendarData(year: number, month: number): Promise<{
        leaves: {
            id: string;
            date: string;
            status: "pending" | "approved" | "rejected";
            userId: string;
            userName: string;
            userImage: string | null;
            leaveType: import("@prisma/client").$Enums.LeaveType;
            reason: string;
            department: string;
            isHalfDay: boolean;
            halfDayType: import("@prisma/client").$Enums.HalfdayType | null;
        }[];
        stats: {
            total: number;
            approved: number;
            pending: number;
            rejected: number;
        };
    }>;
    private calculateDeductionsByYear;
    private checkSufficientBalance;
    approveLeaveRequest(dto: ApproveLeaveRequestDto): Promise<{
        user: {
            employeeId: string | null;
            name: string;
            cardNumber: string | null;
            validFrom: Date | null;
            validTo: Date | null;
            epfNo: string | null;
            password: string;
            nic: string | null;
            jobPosition: string | null;
            joinDate: Date | null;
            address: string | null;
            email: string;
            imagePath: string | null;
            id: number;
            isAdmin: boolean;
            createdAt: Date;
            updatedAt: Date;
            refreshToken: string | null;
            active: boolean;
        };
        dates: {
            id: number;
            isHalfDay: boolean;
            requestId: number;
            leaveDate: Date;
            halfdayType: import("@prisma/client").$Enums.HalfdayType | null;
        }[];
    } & {
        id: number;
        userId: number;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        reason: string | null;
        approvedBy: number | null;
        status: import("@prisma/client").$Enums.LeaveStatus | null;
        requestedAt: Date;
        approvedAt: Date | null;
        rejectedAt: Date | null;
    }>;
    cancelLeaveRequest(dto: CancelLeaveRequestDto): Promise<{
        user: {
            employeeId: string | null;
            name: string;
            cardNumber: string | null;
            validFrom: Date | null;
            validTo: Date | null;
            epfNo: string | null;
            password: string;
            nic: string | null;
            jobPosition: string | null;
            joinDate: Date | null;
            address: string | null;
            email: string;
            imagePath: string | null;
            id: number;
            isAdmin: boolean;
            createdAt: Date;
            updatedAt: Date;
            refreshToken: string | null;
            active: boolean;
        };
        dates: {
            id: number;
            isHalfDay: boolean;
            requestId: number;
            leaveDate: Date;
            halfdayType: import("@prisma/client").$Enums.HalfdayType | null;
        }[];
    } & {
        id: number;
        userId: number;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        reason: string | null;
        approvedBy: number | null;
        status: import("@prisma/client").$Enums.LeaveStatus | null;
        requestedAt: Date;
        approvedAt: Date | null;
        rejectedAt: Date | null;
    }>;
    updateLeavePolicy(leaveType: LeaveType, newDefaultBalance: number): Promise<{
        message: string;
    }>;
    findLeavePolicy(): Promise<{
        leaveType: import("@prisma/client").$Enums.LeaveType;
        defaultBalance: number;
    }[]>;
    findLeaveRequests(userId?: number): Promise<({
        user: {
            name: string;
            jobPosition: string | null;
            email: string;
            imagePath: string | null;
            id: number;
        };
        dates: {
            id: number;
            isHalfDay: boolean;
            requestId: number;
            leaveDate: Date;
            halfdayType: import("@prisma/client").$Enums.HalfdayType | null;
        }[];
    } & {
        id: number;
        userId: number;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        reason: string | null;
        approvedBy: number | null;
        status: import("@prisma/client").$Enums.LeaveStatus | null;
        requestedAt: Date;
        approvedAt: Date | null;
        rejectedAt: Date | null;
    })[]>;
    getLeaveBalance(userId: number, year: number, leaveType: LeaveType): Promise<{
        id: number;
        userId: number;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        year: number;
        balance: number;
    }>;
    testEndpoint(): Promise<{
        message: string;
        timestamp: string;
        status: string;
    }>;
}
