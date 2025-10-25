import { SyncHistoryService } from './sync-history.service';
import { CreateSyncHistoryDto } from './dto/sync-history.dto';
export declare class SyncHistoryController {
    private readonly syncHistoryService;
    constructor(syncHistoryService: SyncHistoryService);
    create(dto: CreateSyncHistoryDto): Promise<{
        id: number;
        status: string;
        totalUsers: number;
        newUsers: number;
        updatedUsers: number;
        syncTime: Date;
    }>;
    findRecent(limit: string): Promise<{
        id: number;
        status: string;
        totalUsers: number;
        newUsers: number;
        updatedUsers: number;
        syncTime: Date;
    }[]>;
}
