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
exports.PunchesController = void 0;
const common_1 = require("@nestjs/common");
const punches_service_1 = require("./punches.service");
const punches_dto_1 = require("./dto/punches.dto");
let PunchesController = class PunchesController {
    punchesService;
    constructor(punchesService) {
        this.punchesService = punchesService;
    }
    create(dto) {
        return this.punchesService.insertPunch(dto);
    }
    latest(limit, employeeId) {
        const n = limit !== undefined ? parseInt(limit, 10) : undefined;
        if (limit !== undefined && Number.isNaN(n)) {
            throw new common_1.BadRequestException("Invalid number for 'limit'");
        }
        return this.punchesService.getLatestPunches(n, employeeId);
    }
    async getPunches(employeeId, name, date, from, to) {
        let eventTime;
        if (date) {
            const d = new Date(date);
            if (isNaN(d.getTime())) {
                throw new common_1.BadRequestException("Invalid date format for 'date'");
            }
            eventTime = d;
        }
        else if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                throw new common_1.BadRequestException("Invalid date format for 'from'/'to'");
            }
            eventTime = { from: fromDate, to: toDate };
        }
        return this.punchesService.getPunches({ employeeId, name, eventTime });
    }
    async deletePunch(id) {
        return this.punchesService.deletePunch(id);
    }
};
exports.PunchesController = PunchesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [punches_dto_1.CreatePunchDto]),
    __metadata("design:returntype", void 0)
], PunchesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('latest'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PunchesController.prototype, "latest", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "getPunches", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "deletePunch", null);
exports.PunchesController = PunchesController = __decorate([
    (0, common_1.Controller)('punches'),
    __metadata("design:paramtypes", [punches_service_1.PunchesService])
], PunchesController);
//# sourceMappingURL=punches.controller.js.map