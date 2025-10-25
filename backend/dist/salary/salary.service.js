"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let SalaryService = class SalaryService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getAllEmployees() {
        try {
            console.log('🔍 [Backend] Starting to fetch employees...');
            const employees = await this.db.user.findMany({
                where: { active: true },
                include: {
                    salaryConfigs: {
                        orderBy: { effectiveFrom: 'desc' },
                        take: 1,
                    },
                },
            });
            console.log(`📊 [Backend] Raw database query result:`, {
                totalEmployees: employees.length,
                employees: employees.map(emp => ({
                    id: emp.id,
                    name: emp.name,
                    epfNo: emp.epfNo,
                    active: emp.active,
                    salaryConfigsCount: emp.salaryConfigs.length,
                    hasJobPosition: !!emp.jobPosition
                }))
            });
            if (employees.length === 0) {
                console.log('❌ [Backend] No active employees found in database');
                return [];
            }
            const mappedEmployees = employees.map(emp => {
                const latestConfig = emp.salaryConfigs[0] || {
                    basicSalary: 0,
                    otRate: 0,
                    allowance: 0,
                    deduction: 0,
                };
                const netSalary = latestConfig.basicSalary +
                    (latestConfig.allowance || 0) -
                    (latestConfig.deduction || 0);
                const mappedEmployee = {
                    id: emp.id,
                    name: emp.name,
                    epfNo: emp.epfNo || '',
                    jobPosition: emp.jobPosition || '',
                    basicSalary: latestConfig.basicSalary,
                    otRate: latestConfig.otRate || 0,
                    allowance: latestConfig.allowance || 0,
                    deduction: latestConfig.deduction || 0,
                    totalLeaveDays: 0,
                    netSalary,
                };
                console.log(`👤 [Backend] Mapped employee:`, mappedEmployee);
                return mappedEmployee;
            });
            console.log(`✅ [Backend] Successfully mapped ${mappedEmployees.length} employees`);
            return mappedEmployees;
        }
        catch (error) {
            console.error('❌ [Backend] Error fetching employees:', error);
            return [];
        }
    }
    async saveSalaryConfig(body) {
        try {
            const { userId, basicSalary, otRate, allowance = 0, deduction = 0 } = body;
            const user = await this.db.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            const salaryConfig = await this.db.salaryConfig.create({
                data: {
                    userId,
                    basicSalary,
                    otRate,
                    allowance,
                    deduction,
                },
            });
            return salaryConfig;
        }
        catch (error) {
            console.error('Error saving salary config:', error);
            throw new Error(`Failed to save salary configuration: ${error.message}`);
        }
    }
    async calculateSalary(userId, month, year) {
        try {
            const user = await this.db.user.findUnique({
                where: { id: userId },
                include: {
                    salaryConfigs: {
                        orderBy: { effectiveFrom: 'desc' },
                        take: 1,
                    },
                },
            });
            if (!user || !user.salaryConfigs.length) {
                throw new Error('User or salary configuration not found');
            }
            const config = user.salaryConfigs[0];
            const overtimeHours = await this.calculateOvertimeHours(userId, month, year);
            const totalLeaveDays = await this.calculateLeaveDays(userId, month, year);
            const overtimePay = overtimeHours * (config.otRate || 0);
            const leaveDeductions = (config.basicSalary / 30) * totalLeaveDays;
            const grossSalary = config.basicSalary + overtimePay + (config.allowance || 0);
            const netSalary = grossSalary - (config.deduction || 0) - leaveDeductions;
            return {
                basicSalary: config.basicSalary,
                overtimeHours,
                overtimePay,
                allowance: config.allowance || 0,
                deduction: config.deduction || 0,
                totalLeaveDays,
                leaveDeductions,
                grossSalary,
                netSalary: Math.max(0, netSalary),
            };
        }
        catch (error) {
            console.error('Error calculating salary:', error);
            throw new Error(`Failed to calculate salary: ${error.message}`);
        }
    }
    async generateSalaryForEmployee(userId, month, year) {
        try {
            const calculation = await this.calculateSalary(userId, month, year);
            const existingRecord = await this.db.salaryRecord.findFirst({
                where: {
                    userId,
                    month,
                    year,
                },
            });
            if (existingRecord) {
                const updatedRecord = await this.db.salaryRecord.update({
                    where: { id: existingRecord.id },
                    data: {
                        basicSalary: calculation.basicSalary,
                        totalLeave: calculation.totalLeaveDays,
                        leaveDeductions: calculation.leaveDeductions,
                        overtimePay: calculation.overtimePay,
                        netSalary: calculation.netSalary,
                    },
                });
                return updatedRecord;
            }
            const salaryRecord = await this.db.salaryRecord.create({
                data: {
                    userId,
                    month,
                    year,
                    basicSalary: calculation.basicSalary,
                    totalLeave: calculation.totalLeaveDays,
                    leaveDeductions: calculation.leaveDeductions,
                    overtimePay: calculation.overtimePay,
                    netSalary: calculation.netSalary,
                },
            });
            return salaryRecord;
        }
        catch (error) {
            console.error('Error generating salary record:', error);
            throw new Error(`Failed to generate salary record: ${error.message}`);
        }
    }
    async calculateOvertimeHours(userId, month, year) {
        try {
            const user = await this.db.user.findUnique({
                where: { id: userId },
                include: {
                    attendanceDays: {
                        where: {
                            workDate: {
                                gte: new Date(year, month - 1, 1),
                                lt: new Date(year, month, 1),
                            },
                        },
                    },
                },
            });
            if (!user)
                return 0;
            const totalOvertimeSeconds = user.attendanceDays.reduce((sum, day) => sum + (day.overtimeSeconds || 0), 0);
            return totalOvertimeSeconds / 3600;
        }
        catch (error) {
            console.error('Error calculating overtime hours:', error);
            return 0;
        }
    }
    async calculateLeaveDays(userId, month, year) {
        try {
            const leaveRequests = await this.db.leave_request.findMany({
                where: {
                    userId,
                    status: 'APPROVED',
                    dates: {
                        some: {
                            leaveDate: {
                                gte: new Date(year, month - 1, 1),
                                lt: new Date(year, month, 1),
                            },
                        },
                    },
                },
                include: {
                    dates: true,
                },
            });
            let totalLeaveDays = 0;
            leaveRequests.forEach(request => {
                request.dates.forEach(date => {
                    if (date.isHalfDay) {
                        totalLeaveDays += 0.5;
                    }
                    else {
                        totalLeaveDays += 1;
                    }
                });
            });
            return totalLeaveDays;
        }
        catch (error) {
            console.error('Error calculating leave days:', error);
            return 0;
        }
    }
    async getSalaryConfig(userId) {
        try {
            const config = await this.db.salaryConfig.findFirst({
                where: { userId },
                orderBy: { effectiveFrom: 'desc' },
            });
            return config;
        }
        catch (error) {
            console.error('Error fetching salary config:', error);
            throw new Error(`Failed to fetch salary configuration: ${error.message}`);
        }
    }
    async getSalaryRecords(userId) {
        try {
            const records = await this.db.salaryRecord.findMany({
                where: { userId },
                orderBy: [
                    { year: 'desc' },
                    { month: 'desc' }
                ],
            });
            return records;
        }
        catch (error) {
            console.error('Error fetching salary records:', error);
            throw new Error(`Failed to fetch salary records: ${error.message}`);
        }
    }
    async getSalaryRecordsByPeriod(month, year) {
        try {
            const records = await this.db.salaryRecord.findMany({
                where: {
                    month,
                    year
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            epfNo: true,
                            jobPosition: true,
                            employeeId: true,
                        },
                    },
                },
                orderBy: {
                    user: {
                        name: 'asc'
                    }
                },
            });
            return records;
        }
        catch (error) {
            console.error('Error fetching salary records by period:', error);
            throw new Error(`Failed to fetch salary records: ${error.message}`);
        }
    }
    async getSalaryCalculation(userId, month, year) {
        return this.calculateSalary(userId, month, year);
    }
    async findUserByEmployeeId(employeeId) {
        try {
            console.log('🔍 [Service] Finding user by employeeId:', employeeId);
            const user = await this.db.user.findUnique({
                where: { employeeId },
                include: {
                    salaryConfigs: {
                        orderBy: { effectiveFrom: 'desc' },
                        take: 1,
                    },
                },
            });
            if (!user) {
                console.warn('⚠️ [Service] User not found with employeeId:', employeeId);
                return null;
            }
            const latestConfig = user.salaryConfigs[0] || {
                basicSalary: 0,
                otRate: 0,
                allowance: 0,
                deduction: 0,
            };
            const netSalary = latestConfig.basicSalary +
                (latestConfig.allowance || 0) -
                (latestConfig.deduction || 0);
            const employeeData = {
                id: user.id,
                name: user.name,
                epfNo: user.epfNo || '',
                jobPosition: user.jobPosition || '',
                basicSalary: latestConfig.basicSalary,
                otRate: latestConfig.otRate || 0,
                allowance: latestConfig.allowance || 0,
                deduction: latestConfig.deduction || 0,
                totalLeaveDays: 0,
                netSalary,
            };
            console.log('✅ [Service] User found by employeeId:', employeeData);
            return employeeData;
        }
        catch (error) {
            console.error('❌ [Service] Error finding user by employeeId:', error);
            throw error;
        }
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SalaryService);
//# sourceMappingURL=salary.service.js.map