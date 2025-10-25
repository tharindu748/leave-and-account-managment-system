import type { Response } from 'express';
import { SalaryService, EmployeeSalary } from './salary.service';
import type { SalaryConfigDto } from './salary.service';
export declare class SalaryController {
    private readonly salaryService;
    constructor(salaryService: SalaryService);
    getEmployees(): Promise<EmployeeSalary[]>;
    test(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    saveSalary(body: SalaryConfigDto): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            userId: number;
            deduction: number | null;
            effectiveFrom: Date;
            basicSalary: number;
            otRate: number | null;
            allowance: number | null;
        };
    }>;
    getSalaryConfig(userId: string): Promise<{
        status: string;
        data: {
            id: number;
            userId: number;
            deduction: number | null;
            effectiveFrom: Date;
            basicSalary: number;
            otRate: number | null;
            allowance: number | null;
        } | null;
    }>;
    calculateSalary(userId: string, month: string, year: string): Promise<{
        status: string;
        data: import("./salary.service").SalaryCalculation;
    }>;
    generateSalaryRecord(userId: number, month: number, year: number): Promise<{
        status: string;
        message: string;
        data: {
            id: number;
            userId: number;
            year: number;
            month: number;
            basicSalary: number;
            overtimePay: number;
            leaveDeductions: number;
            netSalary: number;
            totalLeave: number;
            generatedAt: Date;
        };
    }>;
    getSalaryRecords(userId: string): Promise<{
        status: string;
        data: {
            id: number;
            userId: number;
            year: number;
            month: number;
            basicSalary: number;
            overtimePay: number;
            leaveDeductions: number;
            netSalary: number;
            totalLeave: number;
            generatedAt: Date;
        }[];
    }>;
    getSalaryRecordsByPeriod(month: string, year: string): Promise<{
        status: string;
        data: ({
            user: {
                employeeId: string | null;
                name: string;
                epfNo: string | null;
                jobPosition: string | null;
            };
        } & {
            id: number;
            userId: number;
            year: number;
            month: number;
            basicSalary: number;
            overtimePay: number;
            leaveDeductions: number;
            netSalary: number;
            totalLeave: number;
            generatedAt: Date;
        })[];
    }>;
    getSalaryRecordsByPeriodFilter(month?: number, year?: number): Promise<{
        status: string;
        data: any;
    }>;
    downloadSalarySheet(month: string, year: string, res: Response): Promise<void>;
    private convertToCSV;
    getEmployeeByEpfNo(epfNo: string): Promise<{
        status: string;
        data: {
            id: number;
            name: string;
            epfNo: string;
            jobPosition: string;
            basicSalary: number;
            otRate: number;
            allowance: number;
            deduction: number;
            totalLeaveDays: number;
            netSalary: number;
        };
    }>;
}
