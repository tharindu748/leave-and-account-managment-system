import { DatabaseService } from 'src/database/database.service';
import { CreatePunchDto } from './dto/punches.dto';
type EventTime = Date | {
    from: Date;
    to: Date;
};
interface GetPunchesParams {
    employeeId?: string;
    name?: string;
    eventTime?: EventTime;
}
export declare class PunchesService {
    private prisma;
    constructor(prisma: DatabaseService);
    getLatestPunches(limit?: number, employeeId?: string): Promise<({
        user: {
            name: string;
        };
    } & {
        employeeId: string;
        id: number;
        createdAt: Date;
        eventTime: Date;
        direction: import("@prisma/client").$Enums.Direction;
        source: import("@prisma/client").$Enums.Source;
        note: string | null;
        createdBy: string | null;
        correctEventTime: Date | null;
        deletedAt: Date | null;
        directionCorrected: boolean;
        originalDirection: import("@prisma/client").$Enums.Direction | null;
        correctedBy: string | null;
        correctionNote: string | null;
        correctedAt: Date | null;
    })[]>;
    insertPunch(dto: CreatePunchDto): Promise<{
        employeeId: string;
        id: number;
        createdAt: Date;
        eventTime: Date;
        direction: import("@prisma/client").$Enums.Direction;
        source: import("@prisma/client").$Enums.Source;
        note: string | null;
        createdBy: string | null;
        correctEventTime: Date | null;
        deletedAt: Date | null;
        directionCorrected: boolean;
        originalDirection: import("@prisma/client").$Enums.Direction | null;
        correctedBy: string | null;
        correctionNote: string | null;
        correctedAt: Date | null;
    } | null>;
    private autoDirectionForDevice;
    private buildDateFilter;
    getPunches({ employeeId, name, eventTime }: GetPunchesParams): Promise<({
        user: {
            name: string;
        };
    } & {
        employeeId: string;
        id: number;
        createdAt: Date;
        eventTime: Date;
        direction: import("@prisma/client").$Enums.Direction;
        source: import("@prisma/client").$Enums.Source;
        note: string | null;
        createdBy: string | null;
        correctEventTime: Date | null;
        deletedAt: Date | null;
        directionCorrected: boolean;
        originalDirection: import("@prisma/client").$Enums.Direction | null;
        correctedBy: string | null;
        correctionNote: string | null;
        correctedAt: Date | null;
    })[]>;
    deletePunch(id: number): Promise<{
        employeeId: string;
        id: number;
        createdAt: Date;
        eventTime: Date;
        direction: import("@prisma/client").$Enums.Direction;
        source: import("@prisma/client").$Enums.Source;
        note: string | null;
        createdBy: string | null;
        correctEventTime: Date | null;
        deletedAt: Date | null;
        directionCorrected: boolean;
        originalDirection: import("@prisma/client").$Enums.Direction | null;
        correctedBy: string | null;
        correctionNote: string | null;
        correctedAt: Date | null;
    }>;
}
export {};
