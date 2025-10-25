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
exports.LeaveController = void 0;
const common_1 = require("@nestjs/common");
const leave_service_1 = require("./leave.service");
const create_leave_request_dto_1 = require("./dto/create_leave_request.dto");
const client_1 = require("@prisma/client");
const approve_leave_request_dto_1 = require("./dto/approve_leave_request.dto");
const cancel_leave_request_dto_1 = require("./dto/cancel_leave_request.dto");
const update_leave_policy_dto_1 = require("./dto/update_leave_policy.dto");
let LeaveController = class LeaveController {
    leaveService;
    constructor(leaveService) {
        this.leaveService = leaveService;
    }
    async createLeaveRequest(data) {
        return this.leaveService.createLeaveRequest(data);
    }
    async getLeaveRequests(userId) {
        let parsedId;
        if (userId !== undefined) {
            if (userId === '')
                throw new common_1.BadRequestException('userId cannot be empty');
            const n = Number(userId);
            if (!Number.isInteger(n)) {
                throw new common_1.BadRequestException('userId must be an integer');
            }
            parsedId = n;
        }
        return this.leaveService.findLeaveRequests(parsedId);
    }
    async getCalendarData(year, month) {
        const currentDate = new Date();
        const yearNum = year ? parseInt(year) : currentDate.getFullYear();
        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1;
        if (isNaN(yearNum) || isNaN(monthNum)) {
            throw new common_1.BadRequestException('Invalid year or month parameters');
        }
        if (monthNum < 1 || monthNum > 12) {
            throw new common_1.BadRequestException('Month must be between 1 and 12');
        }
        return this.leaveService.getCalendarData(yearNum, monthNum);
    }
    async getLeaveBalance(userId, year, leaveType) {
        return this.leaveService.getLeaveBalance(userId, year, leaveType);
    }
    async approveLeaveRequest(data) {
        return this.leaveService.approveLeaveRequest(data);
    }
    async cancelLeaveRequest(data) {
        return this.leaveService.cancelLeaveRequest(data);
    }
    async getLeavePolicy() {
        return this.leaveService.findLeavePolicy();
    }
    async updateLeavePolicy(data) {
        return this.leaveService.updateLeavePolicy(data.leaveType, data.defaultBalance);
    }
    async testEndpoint() {
        return this.leaveService.testEndpoint();
    }
};
exports.LeaveController = LeaveController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_leave_request_dto_1.CreateLeaveRequestDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "createLeaveRequest", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveRequests", null);
__decorate([
    (0, common_1.Get)('calendar'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getCalendarData", null);
__decorate([
    (0, common_1.Get)('balance/:userId/:year/:leaveType'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('leaveType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeaveBalance", null);
__decorate([
    (0, common_1.Post)('approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_leave_request_dto_1.ApproveLeaveRequestDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "approveLeaveRequest", null);
__decorate([
    (0, common_1.Post)('rejected'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancel_leave_request_dto_1.CancelLeaveRequestDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "cancelLeaveRequest", null);
__decorate([
    (0, common_1.Get)('policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "getLeavePolicy", null);
__decorate([
    (0, common_1.Patch)('policy'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_leave_policy_dto_1.UpdateLeavePolicyDto]),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "updateLeavePolicy", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveController.prototype, "testEndpoint", null);
exports.LeaveController = LeaveController = __decorate([
    (0, common_1.Controller)('leave'),
    __metadata("design:paramtypes", [leave_service_1.LeaveService])
], LeaveController);
//# sourceMappingURL=leave.controller.js.map