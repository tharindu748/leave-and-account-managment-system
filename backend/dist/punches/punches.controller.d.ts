import { PunchesService } from './punches.service';
import { CreatePunchDto } from './dto/punches.dto';
export declare class PunchesController {
    private readonly punchesService;
    constructor(punchesService: PunchesService);
    create(dto: CreatePunchDto): Promise<{
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
    latest(limit?: string, employeeId?: string): Promise<({
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
    getPunches(employeeId?: string, name?: string, date?: string, from?: string, to?: string): Promise<({
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
