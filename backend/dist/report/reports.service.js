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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMostLateEmployees() {
        const result = await this.prisma.attendanceDay.groupBy({
            by: ['employeeId'],
            _sum: { notWorkingSeconds: true },
            _count: true,
            orderBy: { _sum: { notWorkingSeconds: 'desc' } },
            take: 10,
        });
        const users = await this.prisma.user.findMany({
            where: { employeeId: { in: result.map((r) => r.employeeId) } },
            select: { name: true, employeeId: true },
        });
        return result.map((r) => ({
            name: users.find((u) => u.employeeId === r.employeeId)?.name || 'Unknown',
            late: Math.round((r._sum.notWorkingSeconds || 0) / 60),
            workingDays: r._count,
        }));
    }
    async getLeastLateEmployees() {
        const result = await this.prisma.attendanceDay.groupBy({
            by: ['employeeId'],
            _sum: { notWorkingSeconds: true },
            _count: true,
            orderBy: { _sum: { notWorkingSeconds: 'asc' } },
            take: 10,
        });
        const users = await this.prisma.user.findMany({
            where: { employeeId: { in: result.map((r) => r.employeeId) } },
            select: { name: true, employeeId: true },
        });
        return result.map((r) => ({
            name: users.find((u) => u.employeeId === r.employeeId)?.name || 'Unknown',
            late: Math.round((r._sum.notWorkingSeconds || 0) / 60),
            workingDays: r._count,
        }));
    }
    async getSummary(date) {
        const totalEmployees = await this.prisma.user.count({
            where: { active: true },
        });
        const totalAbsent = await this.prisma.attendanceDay.count({
            where: {
                workDate: date,
                status: 'ABSENT',
            },
        });
        const totalPartial = await this.prisma.attendanceDay.count({
            where: {
                workDate: date,
                status: 'PARTIAL',
            },
        });
        const totalPresent = totalEmployees - totalAbsent;
        return [
            { title: 'Total Employees', count: totalEmployees, percentage: 100 },
            {
                title: 'Present',
                count: totalPresent,
                percentage: (totalPresent / totalEmployees) * 100,
                color: 'green',
            },
            {
                title: 'Absent',
                count: totalAbsent,
                percentage: (totalAbsent / totalEmployees) * 100,
                color: 'red',
            },
            {
                title: 'Partial',
                count: totalPartial,
                percentage: (totalPartial / totalEmployees) * 100,
                color: 'orange',
            },
        ];
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map