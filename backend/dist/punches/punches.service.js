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
exports.PunchesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const database_service_1 = require("../database/database.service");
let PunchesService = class PunchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLatestPunches(limit, employeeId) {
        return this.prisma.punch.findMany({
            where: {
                ...(employeeId ? { employeeId } : {}),
                deletedAt: null,
            },
            orderBy: [{ correctEventTime: 'desc' }, { eventTime: 'desc' }],
            ...(typeof limit === 'number' ? { take: limit } : {}),
            include: {
                user: { select: { name: true } },
            },
        });
    }
    async insertPunch(dto) {
        const eventTime = new Date(dto.eventTime);
        let direction = dto.direction;
        if (dto.source === 'manual') {
            if (!direction || !['IN', 'OUT'].includes(direction)) {
                throw new common_1.BadRequestException("Manual punches require a valid 'direction' (IN/OUT).");
            }
        }
        if (dto.source === 'device' &&
            (!direction || !['IN', 'OUT'].includes(direction))) {
            direction = await this.autoDirectionForDevice(dto.employeeId, eventTime);
        }
        try {
            const punch = await this.prisma.punch.create({
                data: {
                    employeeId: dto.employeeId,
                    eventTime,
                    correctEventTime: eventTime,
                    direction: direction,
                    source: dto.source,
                    note: dto.note,
                    createdBy: dto.createdBy,
                },
            });
            return punch;
        }
        catch (e) {
            if (e.code === 'P2002') {
                return null;
            }
            throw e;
        }
    }
    async autoDirectionForDevice(employeeId, eventTime) {
        const utcYear = eventTime.getUTCFullYear();
        const utcMonth = eventTime.getUTCMonth();
        const utcDate = eventTime.getUTCDate();
        const dayStart = new Date(Date.UTC(utcYear, utcMonth, utcDate));
        const last = await this.prisma.punch.findFirst({
            where: {
                employeeId,
                correctEventTime: { gte: dayStart, lt: eventTime },
            },
            orderBy: { correctEventTime: 'desc' },
            select: { direction: true },
        });
        if (!last)
            return client_1.Direction.IN;
        return last.direction === client_1.Direction.IN ? client_1.Direction.OUT : client_1.Direction.IN;
    }
    buildDateFilter(eventTime) {
        if (!eventTime)
            return undefined;
        if (eventTime instanceof Date) {
            const utcYear = eventTime.getUTCFullYear();
            const utcMonth = eventTime.getUTCMonth();
            const utcDate = eventTime.getUTCDate();
            const start = new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0));
            const end = new Date(Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999));
            return { gte: start, lte: end };
        }
        if (eventTime.from && eventTime.to) {
            return { gte: new Date(eventTime.from), lte: new Date(eventTime.to) };
        }
        return undefined;
    }
    async getPunches({ employeeId, name, eventTime }) {
        try {
            const dateFilter = this.buildDateFilter(eventTime);
            const where = {
                ...(employeeId && { employeeId }),
                ...(name && {
                    user: {
                        name: { contains: name, mode: 'insensitive' },
                    },
                }),
                deletedAt: null,
                ...(dateFilter && { correctEventTime: dateFilter }),
            };
            return await this.prisma.punch.findMany({
                where,
                orderBy: [
                    { correctEventTime: 'desc' },
                    { eventTime: 'desc' },
                ],
                include: {
                    user: { select: { name: true } },
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch punches');
        }
    }
    async deletePunch(id) {
        try {
            const punche = await this.prisma.punch.update({
                data: { deletedAt: new Date() },
                where: { id },
            });
            return punche;
        }
        catch (error) {
            console.log(error);
            throw new common_1.NotFoundException('Punch not found');
        }
    }
};
exports.PunchesService = PunchesService;
exports.PunchesService = PunchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PunchesService);
//# sourceMappingURL=punches.service.js.map