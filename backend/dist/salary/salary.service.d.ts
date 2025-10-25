import { DatabaseService } from '../database/database.service';
export interface SalaryConfigDto {
    userId: number;
    basicSalary: number;
    otRate: number;
    allowance?: number;
    deduction?: number;
}
export interface EmployeeSalary {
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
}
export interface SalaryCalculation {
    basicSalary: number;
    overtimeHours: number;
    overtimePay: number;
    allowance: number;
    deduction: number;
    totalLeaveDays: number;
    leaveDeductions: number;
    grossSalary: number;
    netSalary: number;
}
export declare class SalaryService {
    private readonly db;
    constructor(db: DatabaseService);
    getAllEmployees(): Promise<EmployeeSalary[]>;
    saveSalaryConfig(body: SalaryConfigDto): Promise<{
        id: number;
        userId: number;
        deduction: number | null;
        effectiveFrom: Date;
        basicSalary: number;
        otRate: number | null;
        allowance: number | null;
    }>;
    calculateSalary(userId: number, month: number, year: number): Promise<SalaryCalculation>;
    generateSalaryForEmployee(userId: number, month: number, year: number): Promise<{
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
    }>;
    private calculateOvertimeHours;
    private calculateLeaveDays;
    getSalaryConfig(userId: number): Promise<{
        id: number;
        userId: number;
        deduction: number | null;
        effectiveFrom: Date;
        basicSalary: number;
        otRate: number | null;
        allowance: number | null;
    } | null>;
    getSalaryRecords(userId: number): Promise<{
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
    }[]>;
    getSalaryRecordsByPeriod(month: number, year: number): Promise<({
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
    })[]>;
    getSalaryCalculation(userId: number, month: number, year: number): Promise<SalaryCalculation>;
    findUserByEmployeeId(employeeId: string): Promise<{
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
    } | null>;
}
