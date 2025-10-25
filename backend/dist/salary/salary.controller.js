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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const salary_service_1 = require("./salary.service");
let SalaryController = class SalaryController {
    salaryService;
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    async getEmployees() {
        try {
            return await this.salaryService.getAllEmployees();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to fetch employees',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async test() {
        console.log('✅ Test endpoint hit!');
        return { message: 'API is working!', timestamp: new Date() };
    }
    async saveSalary(body) {
        try {
            if (!body.userId || body.basicSalary === undefined) {
                throw new common_1.HttpException('userId and basicSalary are required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            if (body.basicSalary < 0) {
                throw new common_1.HttpException('Basic salary cannot be negative', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.salaryService.saveSalaryConfig(body);
            return {
                status: 'success',
                message: 'Salary configuration saved successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to save salary configuration',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSalaryConfig(userId) {
        try {
            const userIdNum = parseInt(userId);
            if (isNaN(userIdNum)) {
                throw new common_1.HttpException('Invalid user ID', common_1.HttpStatus.BAD_REQUEST);
            }
            const config = await this.salaryService.getSalaryConfig(userIdNum);
            return {
                status: 'success',
                data: config,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to fetch salary configuration',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async calculateSalary(userId, month, year) {
        try {
            const userIdNum = parseInt(userId);
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            if (isNaN(userIdNum) || isNaN(monthNum) || isNaN(yearNum)) {
                throw new common_1.HttpException('Invalid parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            if (monthNum < 1 || monthNum > 12) {
                throw new common_1.HttpException('Month must be between 1 and 12', common_1.HttpStatus.BAD_REQUEST);
            }
            const calculation = await this.salaryService.getSalaryCalculation(userIdNum, monthNum, yearNum);
            return {
                status: 'success',
                data: calculation,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to calculate salary',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateSalaryRecord(userId, month, year) {
        try {
            if (!userId || !month || !year) {
                throw new common_1.HttpException('userId, month, and year are required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            if (month < 1 || month > 12) {
                throw new common_1.HttpException('Month must be between 1 and 12', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.salaryService.generateSalaryForEmployee(userId, month, year);
            return {
                status: 'success',
                message: 'Salary record generated successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to generate salary record',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSalaryRecords(userId) {
        try {
            const userIdNum = parseInt(userId);
            if (isNaN(userIdNum)) {
                throw new common_1.HttpException('Invalid user ID', common_1.HttpStatus.BAD_REQUEST);
            }
            const records = await this.salaryService.getSalaryRecords(userIdNum);
            return {
                status: 'success',
                data: records,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to fetch salary records',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSalaryRecordsByPeriod(month, year) {
        try {
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            if (isNaN(monthNum) || isNaN(yearNum)) {
                throw new common_1.HttpException('Invalid parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            if (monthNum < 1 || monthNum > 12) {
                throw new common_1.HttpException('Month must be between 1 and 12', common_1.HttpStatus.BAD_REQUEST);
            }
            const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
            return {
                status: 'success',
                data: records,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to fetch salary records for period',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSalaryRecordsByPeriodFilter(month, year) {
        try {
            let records;
            if (month && year) {
                records = await this.salaryService.getSalaryRecordsByPeriod(month, year);
            }
            else {
                const currentDate = new Date();
                records = await this.salaryService.getSalaryRecordsByPeriod(currentDate.getMonth() + 1, currentDate.getFullYear());
            }
            return {
                status: 'success',
                data: records,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to fetch salary records', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadSalarySheet(month, year, res) {
        try {
            const monthNum = parseInt(month);
            const yearNum = parseInt(year);
            if (isNaN(monthNum) || isNaN(yearNum)) {
                throw new common_1.HttpException('Invalid parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            if (monthNum < 1 || monthNum > 12) {
                throw new common_1.HttpException('Month must be between 1 and 12', common_1.HttpStatus.BAD_REQUEST);
            }
            const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
            const csv = this.convertToCSV(records);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=salary-${monthNum}-${yearNum}.csv`);
            res.send(csv);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to download salary sheet', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    convertToCSV(records) {
        const headers = ['Name', 'EPF No', 'Position', 'Basic Salary', 'Overtime Pay', 'Allowance', 'Deductions', 'Leave Days', 'Net Salary', 'Generated Date'];
        const csvData = records.map(record => [
            record.user?.name || '',
            record.user?.epfNo || '',
            record.user?.jobPosition || '',
            record.basicSalary,
            record.overtimePay,
            record.allowance || 0,
            record.leaveDeductions,
            record.totalLeave,
            record.netSalary,
            new Date(record.generatedAt).toLocaleDateString()
        ]);
        return [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }
    async getEmployeeByEpfNo(epfNo) {
        try {
            if (!epfNo) {
                throw new common_1.HttpException('EPF No is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const employee = await this.salaryService.findUserByEmployeeId(epfNo);
            if (!employee) {
                throw new common_1.HttpException('Employee not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'success',
                data: employee,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to fetch employee',
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_1.Get)('employees'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "saveSalary", null);
__decorate([
    (0, common_1.Get)('config/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryConfig", null);
__decorate([
    (0, common_1.Get)('calculate/:userId/:month/:year'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "calculateSalary", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('month')),
    __param(2, (0, common_1.Body)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "generateSalaryRecord", null);
__decorate([
    (0, common_1.Get)('records/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryRecords", null);
__decorate([
    (0, common_1.Get)('period/:month/:year'),
    __param(0, (0, common_1.Param)('month')),
    __param(1, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryRecordsByPeriod", null);
__decorate([
    (0, common_1.Get)('period'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getSalaryRecordsByPeriodFilter", null);
__decorate([
    (0, common_1.Get)('download/:month/:year'),
    __param(0, (0, common_1.Param)('month')),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "downloadSalarySheet", null);
__decorate([
    (0, common_1.Get)('employee/:epfNo'),
    __param(0, (0, common_1.Param)('epfNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getEmployeeByEpfNo", null);
exports.SalaryController = SalaryController = __decorate([
    (0, common_1.Controller)('salary'),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
//# sourceMappingURL=salary.controller.js.map