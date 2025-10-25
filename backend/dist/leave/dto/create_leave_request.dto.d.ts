import { LeaveType, HalfdayType } from '@prisma/client';
import { LeaveDateDto } from './leave_date.dto';
export declare class CreateLeaveRequestDto {
    userId: number;
    leaveType: LeaveType;
    halfDayType?: HalfdayType;
    reason?: string;
    dates: LeaveDateDto[];
}
