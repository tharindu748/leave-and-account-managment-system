import { DatabaseService } from 'src/database/database.service';
import { CreateSyncHistoryDto } from './dto/sync-history.dto';
export declare class SyncHistoryService {
    private prisma;
    constructor(prisma: DatabaseService);
    addRecord(dto: CreateSyncHistoryDto): Promise<{
        id: number;
        status: string;
        totalUsers: number;
        newUsers: number;
        updatedUsers: number;
        syncTime: Date;
    }>;
    listRecent(limit?: number): Promise<{
        id: number;
        status: string;
        totalUsers: number;
        newUsers: number;
        updatedUsers: number;
        syncTime: Date;
    }[]>;
}
