import { DatabaseService } from '../database/database.service';
export declare class EmployeesService {
    private database;
    constructor(database: DatabaseService);
    updateEmployeeImage(userId: number, imagePath: string): Promise<{
        name: string;
        epfNo: string | null;
        jobPosition: string | null;
        email: string;
        imagePath: string | null;
        id: number;
    }>;
    getEmployeeById(userId: number): Promise<{
        name: string;
        epfNo: string | null;
        jobPosition: string | null;
        email: string;
        imagePath: string | null;
        id: number;
        createdAt: Date;
    }>;
}
