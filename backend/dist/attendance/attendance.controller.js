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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const attendance_dto_1 = require("./dto/attendance.dto");
const update_attendance_config_dto_1 = require("./dto/update-attendance-config.dto");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    calculate(dto) {
        return this.attendanceService.calculateAttendance(dto);
    }
    findAllAttendanceUser(employeeId) {
        return this.attendanceService.findAllAttendanceUser(employeeId);
    }
    get(employeeId, workDate) {
        return this.attendanceService.findAttendanceDay(employeeId, workDate);
    }
    recalcUserAllDays(employeeId, persist = 'true') {
        return this.attendanceService.recalcUserAllDays(employeeId, persist !== 'false');
    }
    recalcAllUsersAllDays(persist = 'true') {
        return this.attendanceService.recalcAllUsersAllDays(persist !== 'false');
    }
    async getConfig() {
        return this.attendanceService.getAttendanceConfig();
    }
    async updateConfig(dto) {
        return this.attendanceService.updateAttendanceConfig(dto);
    }
    async getMonthlyRecords(month, employees, tz) {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
            throw new common_1.BadRequestException('month must be YYYY-MM');
        }
        const empList = employees
            ? employees
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined;
        return this.attendanceService.getMonthRecords({
            month,
            employeeIds: empList,
            timezone: tz || 'Asia/Colombo',
        });
    }
    async getDaySnapshot(date, employees, tz) {
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new common_1.BadRequestException('date must be YYYY-MM-DD');
        }
        const empList = employees
            ? employees
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined;
        return this.attendanceService.getDaySnapshot({
            date,
            employeeIds: empList,
            timezone: tz || 'Asia/Colombo',
        });
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CalculateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)('recalc-all-days/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAllAttendanceUser", null);
__decorate([
    (0, common_1.Get)(':employeeId/:workDate'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Param)('workDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('recalc-all-days/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Query)('persistNormalization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "recalcUserAllDays", null);
__decorate([
    (0, common_1.Post)('recalc-all-users'),
    __param(0, (0, common_1.Query)('persistNormalization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "recalcAllUsersAllDays", null);
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Patch)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_attendance_config_dto_1.UpdateAttendanceConfigDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('records'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('employees')),
    __param(2, (0, common_1.Query)('tz')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMonthlyRecords", null);
__decorate([
    (0, common_1.Get)('day'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('employees')),
    __param(2, (0, common_1.Query)('tz')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDaySnapshot", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map