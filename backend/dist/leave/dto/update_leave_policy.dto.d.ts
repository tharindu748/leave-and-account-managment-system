import { LeaveType } from '@prisma/client';
export declare class UpdateLeavePolicyDto {
    leaveType: LeaveType;
    defaultBalance: number;
}
