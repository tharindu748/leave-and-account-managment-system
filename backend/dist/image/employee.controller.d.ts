import { EmployeesService } from './employee.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    updateEmployeeImage(id: number, updateData: {
        imagePath: string;
    }): Promise<{
        name: string;
        epfNo: string | null;
        jobPosition: string | null;
        email: string;
        imagePath: string | null;
        id: number;
    }>;
    getEmployee(id: number): Promise<{
        name: string;
        epfNo: string | null;
        jobPosition: string | null;
        email: string;
        imagePath: string | null;
        id: number;
        createdAt: Date;
    }>;
}
