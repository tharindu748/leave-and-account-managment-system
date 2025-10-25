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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
let LeaveService = class LeaveService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getOrInitializeBalance(userId, year, leaveType) {
        let balance = await this.databaseService.leave_balance.findUnique({
            where: {
                userId_year_leaveType: { userId, year, leaveType },
            },
        });
        if (!balance) {
            const policy = await this.databaseService.leave_policy.findUnique({
                where: { leaveType },
            });
            if (!policy) {
                throw new common_1.NotFoundException(`No policy found for leave type: ${leaveType}`);
            }
            balance = await this.databaseService.leave_balance.create({
                data: {
                    userId,
                    year,
                    leaveType,
                    balance: policy.defaultBalance,
                },
            });
        }
        return balance;
    }
    async createLeaveRequest(data) {
        const { userId, leaveType, reason, dates } = data;
        const normalizeDate = (date) => {
            const normalized = new Date(date);
            normalized.setUTCHours(0, 0, 0, 0);
            return normalized;
        };
        const requestedDates = dates.map((d) => normalizeDate(new Date(d.date)));
        const existingDates = await this.databaseService.leave_request_date.findMany({
            where: {
                request: {
                    userId: userId,
                    status: {
                        in: [client_1.LeaveStatus.PENDING, client_1.LeaveStatus.APPROVED],
                    },
                },
                leaveDate: {
                    in: requestedDates,
                },
            },
        });
        if (existingDates.length > 0) {
            const conflictingDates = existingDates
                .map((d) => d.leaveDate.toISOString().split('T')[0])
                .join(', ');
            throw new common_1.ConflictException(`Leave request already exists for this user on the following dates : ${conflictingDates}`);
        }
        const datesForCheck = dates.map((d) => ({
            date: normalizeDate(new Date(d.date)).toISOString(),
            isHalfDay: !!d.isHalfDay,
        }));
        await this.checkSufficientBalance(userId, leaveType, datesForCheck);
        return this.databaseService.leave_request.create({
            data: {
                user: { connect: { id: userId } },
                leaveType,
                reason,
                dates: {
                    create: dates.map((d) => ({
                        leaveDate: normalizeDate(new Date(d.date)),
                        isHalfDay: d.isHalfDay ?? false,
                        halfdayType: d.isHalfDay ? d.halfDayType : null,
                    })),
                },
            },
            include: {
                dates: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        jobPosition: true,
                    },
                },
            },
        });
    }
    async getCalendarData(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const leaveRequests = await this.databaseService.leave_request.findMany({
            where: {
                dates: {
                    some: {
                        leaveDate: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                status: {
                    in: [client_1.LeaveStatus.PENDING, client_1.LeaveStatus.APPROVED, client_1.LeaveStatus.REJECTED],
                },
            },
            include: {
                dates: {
                    where: {
                        leaveDate: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        jobPosition: true,
                        imagePath: true,
                    },
                },
            },
        });
        const calendarData = leaveRequests.flatMap(request => {
            const status = request.status || client_1.LeaveStatus.PENDING;
            return request.dates.map(date => ({
                id: request.id.toString(),
                date: date.leaveDate.toISOString().split('T')[0],
                status: status.toLowerCase(),
                userId: request.userId.toString(),
                userName: request.user.name,
                userImage: request.user.imagePath,
                leaveType: request.leaveType,
                reason: request.reason || '',
                department: request.user.jobPosition || 'No Position',
                isHalfDay: date.isHalfDay,
                halfDayType: date.halfdayType,
            }));
        });
        return {
            leaves: calendarData,
            stats: {
                total: leaveRequests.length,
                approved: leaveRequests.filter(r => r.status === client_1.LeaveStatus.APPROVED).length,
                pending: leaveRequests.filter(r => r.status === client_1.LeaveStatus.PENDING).length,
                rejected: leaveRequests.filter(r => r.status === client_1.LeaveStatus.REJECTED).length,
            }
        };
    }
    calculateDeductionsByYear(dates) {
        const deductionsByYear = new Map();
        dates.forEach((d) => {
            const year = d.leaveDate.getUTCFullYear();
            const deduction = d.isHalfDay ? 0.5 : 1;
            deductionsByYear.set(year, (deductionsByYear.get(year) || 0) + deduction);
        });
        return deductionsByYear;
    }
    async checkSufficientBalance(userId, leaveType, dates) {
        const normalizedDates = dates.map((d) => ({
            leaveDate: new Date(d.date),
            isHalfDay: d.isHalfDay ?? false,
        }));
        const deductionsByYear = this.calculateDeductionsByYear(normalizedDates);
        for (const [year, deduction] of deductionsByYear.entries()) {
            const balance = await this.getOrInitializeBalance(userId, year, leaveType);
            if (balance.balance < deduction) {
                throw new common_1.BadRequestException(`Insufficient ${leaveType} leave balance for year ${year}. Available: ${balance.balance}, Required: ${deduction}`);
            }
        }
    }
    async approveLeaveRequest(dto) {
        const request = await this.databaseService.leave_request.findUnique({
            where: { id: dto.requestId },
            include: { dates: true, user: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (request.status !== client_1.LeaveStatus.PENDING) {
            throw new common_1.BadRequestException('Request is not pending');
        }
        const datesForCheck = request.dates.map((d) => ({
            date: d.leaveDate.toISOString(),
            isHalfDay: d.isHalfDay,
        }));
        await this.checkSufficientBalance(request.userId, request.leaveType, datesForCheck);
        const deductionsByYear = this.calculateDeductionsByYear(request.dates);
        for (const [year, deduction] of deductionsByYear.entries()) {
            await this.databaseService.leave_balance.update({
                where: {
                    userId_year_leaveType: {
                        userId: request.userId,
                        year,
                        leaveType: request.leaveType,
                    },
                },
                data: { balance: { decrement: deduction } },
            });
        }
        return this.databaseService.leave_request.update({
            where: { id: dto.requestId },
            data: {
                status: client_1.LeaveStatus.APPROVED,
                approvedAt: new Date(),
                approvedBy: dto.approvedBy,
            },
            include: { dates: true, user: true },
        });
    }
    async cancelLeaveRequest(dto) {
        const request = await this.databaseService.leave_request.findUnique({
            where: { id: dto.requestId },
            include: { dates: true, user: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Leave request not found');
        }
        if (request.status === client_1.LeaveStatus.REJECTED) {
            throw new common_1.BadRequestException('Request already cancelled');
        }
        if (request.status === client_1.LeaveStatus.APPROVED) {
            const deductionsByYear = this.calculateDeductionsByYear(request.dates);
            for (const [year, deduction] of deductionsByYear.entries()) {
                await this.databaseService.leave_balance.update({
                    where: {
                        userId_year_leaveType: {
                            userId: request.userId,
                            year,
                            leaveType: request.leaveType,
                        },
                    },
                    data: { balance: { increment: deduction } },
                });
            }
        }
        return this.databaseService.leave_request.update({
            where: { id: dto.requestId },
            data: { status: client_1.LeaveStatus.REJECTED, approvedBy: dto.approvedBy },
            include: { dates: true, user: true },
        });
    }
    async updateLeavePolicy(leaveType, newDefaultBalance) {
        const policy = await this.databaseService.leave_policy.upsert({
            where: { leaveType },
            update: { defaultBalance: newDefaultBalance },
            create: { leaveType, defaultBalance: newDefaultBalance },
        });
        const oldDefault = policy.defaultBalance;
        const existingPolicy = await this.databaseService.leave_policy.findUnique({
            where: { leaveType },
        });
        const oldDefaultBalance = existingPolicy
            ? existingPolicy.defaultBalance
            : 0;
        const delta = newDefaultBalance - oldDefaultBalance;
        await this.databaseService.leave_policy.upsert({
            where: { leaveType },
            update: { defaultBalance: newDefaultBalance },
            create: { leaveType, defaultBalance: newDefaultBalance },
        });
        const currentYear = new Date().getUTCFullYear();
        await this.databaseService.leave_balance.updateMany({
            where: { leaveType, year: currentYear },
            data: { balance: { increment: delta } },
        });
        return {
            message: `Policy updated for ${leaveType}. Delta ${delta} applied to all current-year balances.`,
        };
    }
    async findLeavePolicy() {
        return this.databaseService.leave_policy.findMany();
    }
    async findLeaveRequests(userId) {
        const where = userId != null ? { userId } : {};
        return this.databaseService.leave_request.findMany({
            where,
            include: {
                dates: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        jobPosition: true,
                        imagePath: true,
                    }
                },
            },
        });
    }
    async getLeaveBalance(userId, year, leaveType) {
        return this.getOrInitializeBalance(userId, year, leaveType);
    }
    async testEndpoint() {
        return {
            message: 'Leave endpoint is working!',
            timestamp: new Date().toISOString(),
            status: 'OK'
        };
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map