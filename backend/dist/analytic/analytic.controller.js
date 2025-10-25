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
exports.AnalyticController = void 0;
const common_1 = require("@nestjs/common");
const analytic_service_1 = require("./analytic.service");
function toISODateOnly(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
class OptionalDateParamPipe {
    transform(value) {
        if (!value)
            return undefined;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error('date must be in YYYY-MM-DD format');
        }
        return value;
    }
}
let AnalyticController = class AnalyticController {
    analyticService;
    constructor(analyticService) {
        this.analyticService = analyticService;
    }
    async getAttendanceSummary(start, end, employeeId) {
        return this.analyticService.getEmployeeWorkSummary({
            start,
            end,
            employeeId,
        });
    }
    async getMostLateEmployees(start, end, limit) {
        return this.analyticService.getMostLateEmployees({
            start,
            end,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async getLeastLateEmployees(start, end, limit) {
        return this.analyticService.getLeastLateEmployees({
            start,
            end,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async getSummary(date) {
        const dateStr = date ?? toISODateOnly(new Date());
        return this.analyticService.getDailySummary(dateStr);
    }
    async getEmployeeDashboardData(employeeId) {
        const dashboardData = await this.analyticService.getEmployeeDashboardData(employeeId);
        if (!dashboardData) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return dashboardData;
    }
};
exports.AnalyticController = AnalyticController;
__decorate([
    (0, common_1.Get)('attendance-summary'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __param(2, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticController.prototype, "getAttendanceSummary", null);
__decorate([
    (0, common_1.Get)('most-late-employees'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticController.prototype, "getMostLateEmployees", null);
__decorate([
    (0, common_1.Get)('least-late-employees'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticController.prototype, "getLeastLateEmployees", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('date', new OptionalDateParamPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':employeeId/dashboard'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticController.prototype, "getEmployeeDashboardData", null);
exports.AnalyticController = AnalyticController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [analytic_service_1.AnalyticService])
], AnalyticController);
//# sourceMappingURL=analytic.controller.js.map