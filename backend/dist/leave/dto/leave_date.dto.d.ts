import { HalfdayType } from '@prisma/client';
export declare class LeaveDateDto {
    date: Date;
    isHalfDay?: boolean;
    halfDayType?: HalfdayType;
}
