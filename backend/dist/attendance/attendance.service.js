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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const database_service_1 = require("../database/database.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAttendanceDay(employeeId, workDate) {
        try {
            const wd = new Date(workDate);
            return this.prisma.attendanceDay.findUnique({
                where: { employeeId_workDate: { employeeId, workDate: wd } },
            });
        }
        catch (e) {
            throw new common_1.BadRequestException('Invalid date');
        }
    }
    async findAllAttendanceUser(employeeId) {
        try {
            return await this.prisma.attendanceDay.findMany({
                where: { employeeId },
                orderBy: { workDate: 'desc' },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAttendanceConfig() {
        const config = await this.prisma.attendanceConfig.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        if (!config) {
            throw new common_1.BadRequestException('Attendance config not set');
        }
        return config;
    }
    async updateAttendanceConfig(dto) {
        const parse = (time) => {
            const [h, m] = time.split(':').map(Number);
            return new Date(Date.UTC(1970, 0, 1, h, m));
        };
        const existing = await this.prisma.attendanceConfig.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        if (existing) {
            return this.prisma.attendanceConfig.update({
                where: { id: existing.id },
                data: {
                    workStart: parse(dto.workStart),
                    workEnd: parse(dto.workEnd),
                    otEnd: parse(dto.otEnd),
                    earlyStart: parse(dto.earlyStart),
                },
            });
        }
        else {
            return this.prisma.attendanceConfig.create({
                data: {
                    workStart: parse(dto.workStart),
                    workEnd: parse(dto.workEnd),
                    otEnd: parse(dto.otEnd),
                    earlyStart: parse(dto.earlyStart),
                },
            });
        }
    }
    async calculateAttendance(dto, persistNormalization = true) {
        const { employeeId, workDate } = dto;
        const d = new Date(workDate);
        if (isNaN(d.getTime()))
            throw new common_1.BadRequestException('Invalid workDate');
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        const cfg = await this.getAttendanceConfig();
        const workStartH = cfg.workStart.getUTCHours();
        const workStartM = cfg.workStart.getUTCMinutes();
        const workEndH = cfg.workEnd.getUTCHours();
        const workEndM = cfg.workEnd.getUTCMinutes();
        const otEndH = cfg.otEnd.getUTCHours();
        const otEndM = cfg.otEnd.getUTCMinutes();
        const earlyH = cfg.earlyStart.getUTCHours();
        const earlyM = cfg.earlyStart.getUTCMinutes();
        const workStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), workStartH, workStartM, 0);
        const workEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), workEndH, workEndM, 0);
        const otEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), otEndH, otEndM, 0);
        const earlyStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), earlyH, earlyM, 0);
        const totalWorkSeconds = (workEnd.getTime() - workStart.getTime()) / 1000;
        const punches = await this.prisma.punch.findMany({
            where: {
                employeeId,
                eventTime: { gte: dayStart, lte: dayEnd },
                deletedAt: null,
            },
            orderBy: { eventTime: 'asc' },
        });
        let status;
        let firstIn = null;
        let lastOut = null;
        let startTime = null;
        let workedSeconds = 0;
        let overtimeSeconds = 0;
        let notWorkingSeconds = 0;
        let hadManualFlag = false;
        if (!punches.length) {
            status = client_1.AttendanceStatus.ABSENT;
            workedSeconds = 0;
            overtimeSeconds = 0;
            notWorkingSeconds = totalWorkSeconds;
            hadManualFlag = false;
        }
        else {
            const rawEvents = punches.map((p) => [
                p.eventTime,
                p.direction,
                p.source,
            ]);
            const hasManualPunch = rawEvents.some(([, , s]) => s === client_1.Source.manual);
            const [normEvents, adjusted1] = this.normalizeSequence(rawEvents);
            const [periods, adjusted2] = this.buildPeriods(normEvents, d, otEnd);
            hadManualFlag = hasManualPunch || adjusted1 || adjusted2;
            if (persistNormalization && hadManualFlag) {
                await this.persistNormalizedDirections(employeeId, punches, normEvents);
            }
            if (!periods.length) {
                status = client_1.AttendanceStatus.ABSENT;
                workedSeconds = 0;
                overtimeSeconds = 0;
                notWorkingSeconds = totalWorkSeconds;
            }
            else {
                const firstInDt = normEvents.find(([t, dd]) => dd === client_1.Direction.IN && t >= earlyStart)?.[0] || null;
                const lastOutDt = [...normEvents]
                    .reverse()
                    .find(([, dd]) => dd === client_1.Direction.OUT)?.[0] || null;
                firstIn = firstInDt
                    ? firstInDt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                    : null;
                lastOut = lastOutDt
                    ? lastOutDt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                    : null;
                const workStartStr = workStart.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
                startTime =
                    firstInDt && firstInDt <= workStart ? workStartStr : firstIn;
                let ws = 0, os = 0;
                for (const [a, b] of periods) {
                    const aC = this.clip(a, workStart, otEnd);
                    const bC = this.clip(b, workStart, otEnd);
                    if (bC.getTime() <= aC.getTime())
                        continue;
                    ws += this.overlap(aC, bC, workStart, workEnd);
                    os += this.overlap(aC, bC, workEnd, otEnd);
                }
                workedSeconds = Math.round(ws);
                overtimeSeconds = Math.round(os);
                const envStartTime = Math.max(Math.min(...periods.map((p) => p[0].getTime())), workStart.getTime());
                const envEndTime = Math.min(Math.max(...periods.map((p) => p[1].getTime())), otEnd.getTime());
                const envelope = envEndTime > envStartTime ? (envEndTime - envStartTime) / 1000 : 0;
                notWorkingSeconds = Math.max(0, Math.round(envelope - (workedSeconds + overtimeSeconds)));
                let baseStatus;
                if (workedSeconds <= 0)
                    baseStatus = client_1.AttendanceStatus.ABSENT;
                else if (workedSeconds < totalWorkSeconds)
                    baseStatus = client_1.AttendanceStatus.PARTIAL;
                else
                    baseStatus = client_1.AttendanceStatus.OK;
                status = hadManualFlag ? client_1.AttendanceStatus.MANUAL : baseStatus;
            }
        }
        return this.prisma.attendanceDay.upsert({
            where: { employeeId_workDate: { employeeId, workDate: d } },
            create: {
                employeeId,
                workDate: d,
                startTime,
                firstIn,
                lastOut,
                workedSeconds,
                notWorkingSeconds,
                overtimeSeconds,
                hadManual: hadManualFlag,
                status,
            },
            update: {
                startTime,
                firstIn,
                lastOut,
                workedSeconds,
                notWorkingSeconds,
                overtimeSeconds,
                hadManual: hadManualFlag,
                status,
                calculatedAt: new Date(),
            },
        });
    }
    normalizeSequence(events) {
        let expected = client_1.Direction.IN;
        let adjusted = false;
        const norm = [];
        for (const [t, d, s] of events) {
            const nd = d === expected ? d : expected;
            adjusted = adjusted || nd !== d;
            norm.push([t, nd, s]);
            expected = nd === client_1.Direction.IN ? client_1.Direction.OUT : client_1.Direction.IN;
        }
        return [norm, adjusted];
    }
    buildPeriods(normEvents, d, otEnd) {
        const periods = [];
        let currentIn = null;
        let adjusted = false;
        for (const [t, ddir, _] of normEvents) {
            if (ddir === client_1.Direction.IN) {
                currentIn = t;
            }
            else {
                if (currentIn && t > currentIn) {
                    periods.push([currentIn, t]);
                }
                currentIn = null;
            }
        }
        if (currentIn) {
            const endCap = otEnd;
            if (endCap > currentIn) {
                periods.push([currentIn, endCap]);
            }
            adjusted = true;
        }
        return [periods, adjusted];
    }
    async persistNormalizedDirections(employeeId, rawPunches, normEvents, correctedBy = 'auto-normalize') {
        await this.prisma.$transaction(async (tx) => {
            for (let i = 0; i < rawPunches.length; i++) {
                const punch = rawPunches[i];
                const [t, normDir] = normEvents[i];
                const origDir = punch.direction;
                const src = punch.source;
                if (normDir === origDir)
                    continue;
                const conflict = await tx.punch.findFirst({
                    where: {
                        employeeId,
                        eventTime: t,
                        direction: normDir,
                        source: src,
                    },
                });
                if (conflict) {
                    await tx.punch.update({
                        where: { id: punch.id },
                        data: {
                            directionCorrected: true,
                            correctionNote: (punch.correctionNote || '') +
                                ' | skip flip: collision with existing row',
                            correctedAt: new Date(),
                            correctedBy: punch.correctedBy || correctedBy,
                        },
                    });
                }
                else {
                    await tx.punch.update({
                        where: { id: punch.id },
                        data: {
                            originalDirection: punch.directionCorrected
                                ? punch.originalDirection
                                : punch.direction,
                            direction: normDir,
                            directionCorrected: true,
                            correctedBy,
                            correctionNote: (punch.correctionNote || '') + ' | normalized sequence',
                            correctedAt: new Date(),
                        },
                    });
                }
            }
        });
    }
    overlap(a1, a2, b1, b2) {
        const start = Math.max(a1.getTime(), b1.getTime());
        const end = Math.min(a2.getTime(), b2.getTime());
        return Math.max(0, (end - start) / 1000);
    }
    clip(dt, lo, hi) {
        return new Date(Math.max(lo.getTime(), Math.min(hi.getTime(), dt.getTime())));
    }
    ymd(d) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    async recalcUserAllDays(employeeId, persistNormalization = true) {
        if (!employeeId?.trim()) {
            throw new common_1.BadRequestException('employeeId is required');
        }
        const uniqueDays = new Set();
        const pageSize = 2000;
        let cursor = undefined;
        for (;;) {
            const punches = await this.prisma.punch.findMany({
                where: { employeeId },
                select: { id: true, eventTime: true },
                orderBy: { id: 'asc' },
                take: pageSize,
                ...(cursor ? { skip: 1, cursor } : {}),
            });
            if (!punches.length)
                break;
            for (const p of punches)
                uniqueDays.add(this.ymd(p.eventTime));
            cursor = { id: punches[punches.length - 1].id };
            if (punches.length < pageSize)
                break;
        }
        if (uniqueDays.size === 0)
            return { employeeId, daysProcessed: 0 };
        let processed = 0;
        for (const workDate of Array.from(uniqueDays).sort()) {
            await this.calculateAttendance({ employeeId, workDate }, persistNormalization);
            processed++;
        }
        return { employeeId, daysProcessed: processed };
    }
    async recalcAllUsersAllDays(persistNormalization = true) {
        const users = await this.prisma.user.findMany({
            select: { employeeId: true },
            where: {
                active: true,
                employeeId: { not: null },
            },
        });
        const results = [];
        for (const u of users) {
            const empId = u.employeeId;
            const res = await this.recalcUserAllDays(empId, persistNormalization);
            results.push(res);
        }
        return results;
    }
    parseMonthRange(month) {
        const [y, m] = month.split('-').map((n) => parseInt(n, 10));
        const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
        const end = new Date(y, m, 1, 0, 0, 0, 0);
        return { start, end };
    }
    parseDayRange(date) {
        const [y, m, d] = date.split('-').map((n) => parseInt(n, 10));
        const start = new Date(y, m - 1, d, 0, 0, 0, 0);
        const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);
        return { start, end };
    }
    dateKey(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    buildMonthSkeleton(month) {
        const { start, end } = this.parseMonthRange(month);
        const days = [];
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            days.push(this.dateKey(d));
        }
        return days;
    }
    async getMonthRecords(params) {
        const { month, employeeIds, timezone } = params;
        const { start, end } = this.parseMonthRange(month);
        const users = await this.prisma.user.findMany({
            where: {
                active: true,
                employeeId: { not: null },
                ...(employeeIds?.length ? { employeeId: { in: employeeIds } } : {}),
            },
            select: { employeeId: true, name: true },
            orderBy: { name: 'asc' },
        });
        const empIds = users.map((u) => u.employeeId);
        if (empIds.length === 0) {
            return { month, timezone, employees: [] };
        }
        const rows = await this.prisma.attendanceDay.findMany({
            where: {
                employeeId: { in: empIds },
                workDate: { gte: start, lt: end },
            },
            select: {
                employeeId: true,
                workDate: true,
                startTime: true,
                firstIn: true,
                lastOut: true,
                workedSeconds: true,
                notWorkingSeconds: true,
                overtimeSeconds: true,
            },
            orderBy: [{ employeeId: 'asc' }, { workDate: 'asc' }],
        });
        const byEmpDate = new Map();
        for (const r of rows) {
            const key = `${r.employeeId}::${this.dateKey(r.workDate)}`;
            byEmpDate.set(key, {
                startTime: r.startTime,
                firstIn: r.firstIn,
                lastOut: r.lastOut,
                workedSeconds: r.workedSeconds ?? 0,
                notWorkingSeconds: r.notWorkingSeconds ?? 0,
                overtimeSeconds: r.overtimeSeconds ?? 0,
            });
        }
        const days = this.buildMonthSkeleton(month);
        const employees = users.map((u) => {
            const records = days.map((dkey) => {
                const k = `${u.employeeId}::${dkey}`;
                const r = byEmpDate.get(k);
                const start = r?.startTime ?? r?.firstIn ?? null;
                const lastOut = r?.lastOut ?? null;
                return {
                    date: dkey,
                    start,
                    lastOut,
                    workedSeconds: r?.workedSeconds ?? 0,
                    notWorkingSeconds: r?.notWorkingSeconds ?? 0,
                    overtimeSeconds: r?.overtimeSeconds ?? 0,
                };
            });
            return { id: u.employeeId, name: u.name, records };
        });
        return { month, timezone, employees };
    }
    async getDaySnapshot(params) {
        const { date, employeeIds, timezone } = params;
        const { start, end } = this.parseDayRange(date);
        const users = await this.prisma.user.findMany({
            where: {
                active: true,
                employeeId: { not: null },
                ...(employeeIds?.length ? { employeeId: { in: employeeIds } } : {}),
            },
            select: { employeeId: true, name: true },
            orderBy: { name: 'asc' },
        });
        const empIds = users.map((u) => u.employeeId);
        if (empIds.length === 0) {
            return { date, timezone, employees: [] };
        }
        const rows = await this.prisma.attendanceDay.findMany({
            where: {
                employeeId: { in: empIds },
                workDate: { gte: start, lt: end },
            },
            select: {
                employeeId: true,
                startTime: true,
                firstIn: true,
                lastOut: true,
                workedSeconds: true,
                notWorkingSeconds: true,
                overtimeSeconds: true,
            },
        });
        const byEmp = new Map();
        for (const r of rows) {
            byEmp.set(r.employeeId, {
                startTime: r.startTime,
                firstIn: r.firstIn,
                lastOut: r.lastOut,
                workedSeconds: r.workedSeconds ?? 0,
                notWorkingSeconds: r.notWorkingSeconds ?? 0,
                overtimeSeconds: r.overtimeSeconds ?? 0,
            });
        }
        const employees = users.map((u) => {
            const r = byEmp.get(u.employeeId);
            const startVal = r?.startTime ?? r?.firstIn ?? null;
            return {
                id: u.employeeId,
                name: u.name,
                start: startVal,
                lastOut: r?.lastOut ?? null,
                workedSeconds: r?.workedSeconds ?? 0,
                notWorkingSeconds: r?.notWorkingSeconds ?? 0,
                overtimeSeconds: r?.overtimeSeconds ?? 0,
            };
        });
        return { date, timezone, employees };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map