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
    database;
    constructor(database) {
        this.database = database;
    }
    async getEmployeeDashboardData(userId) {
        console.log('🔄 Getting dashboard data for user:', userId);
        const user = await this.database.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                jobPosition: true,
                epfNo: true,
                imagePath: true,
                createdAt: true,
            },
        });
        console.log('🔍 User lookup result:', user);
        if (!user) {
            console.log('⚠️ User not found in DB, returning mock data');
            return this.getMockData(userId);
        }
        const workedSinceJoining = this.calculateWorkedDays(user.createdAt);
        const leaveData = await this.getLeaveData(userId);
        const workHoursThisMonth = await this.getWorkHoursThisMonth(userId);
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            position: user.jobPosition || 'N/A',
            epfNo: user.epfNo || 'N/A',
            image: user.imagePath,
            workedSinceJoining,
            totalLeaveCount: leaveData.totalLeave,
            leaveTaken: {
                sick: leaveData.sickLeave,
                annual: leaveData.annualLeave,
            },
            remainingHolidays: leaveData.remainingHolidays,
            workHoursThisMonth,
        };
    }
    getMockData(userId) {
        return {
            id: userId.toString(),
            name: 'Tharindu (Mock)',
            email: 'tharindu2@gmail.com',
            position: 'Developer',
            epfNo: 'N/A',
            image: null,
            workedSinceJoining: 150,
            totalLeaveCount: 5,
            leaveTaken: {
                sick: 2,
                annual: 3,
            },
            remainingHolidays: 23,
            workHoursThisMonth: 160,
        };
    }
    calculateWorkedDays(joinDate) {
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - joinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    async getLeaveData(userId) {
        const currentYear = new Date().getFullYear();
        const leaveBalances = await this.database.leave_balance.findMany({
            where: {
                userId: userId,
                year: currentYear,
            },
        });
        const approvedLeaves = await this.database.leave_request.findMany({
            where: {
                userId: userId,
                status: 'APPROVED',
                requestedAt: {
                    gte: new Date(`${currentYear}-01-01`),
                    lte: new Date(`${currentYear}-12-31`),
                },
            },
            include: {
                dates: true,
            },
        });
        let sickLeave = 0;
        let annualLeave = 0;
        approvedLeaves.forEach(request => {
            const days = request.dates.reduce((total, date) => {
                return total + (date.isHalfDay ? 0.5 : 1);
            }, 0);
            if (request.leaveType === 'CASUAL') {
                sickLeave += days;
            }
            else if (request.leaveType === 'ANNUAL') {
                annualLeave += days;
            }
        });
        const totalLeave = sickLeave + annualLeave;
        const leavePolicies = await this.database.leave_policy.findMany();
        const annualBalance = leaveBalances.find(lb => lb.leaveType === 'ANNUAL')?.balance || 0;
        const casualBalance = leaveBalances.find(lb => lb.leaveType === 'CASUAL')?.balance || 0;
        const defaultAnnual = leavePolicies.find(lp => lp.leaveType === 'ANNUAL')?.defaultBalance || 21;
        const defaultCasual = leavePolicies.find(lp => lp.leaveType === 'CASUAL')?.defaultBalance || 7;
        const remainingAnnual = annualBalance > 0 ? annualBalance : defaultAnnual - annualLeave;
        const remainingCasual = casualBalance > 0 ? casualBalance : defaultCasual - sickLeave;
        const remainingHolidays = Math.max(0, remainingAnnual + remainingCasual);
        return {
            totalLeave,
            sickLeave,
            annualLeave,
            remainingHolidays,
        };
    }
    async getWorkHoursThisMonth(userId) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const user = await this.database.user.findUnique({
            where: { id: userId },
            select: { employeeId: true }
        });
        if (!user?.employeeId)
            return 0;
        const attendanceDays = await this.database.attendanceDay.findMany({
            where: {
                employeeId: user.employeeId,
                workDate: {
                    gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`),
                    lte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`),
                },
            },
        });
        const totalSeconds = attendanceDays.reduce((sum, day) => sum + day.workedSeconds, 0);
        const totalHours = Math.round(totalSeconds / 3600);
        return totalHours;
    }
    async getMostLateEmployees() {
        const result = await this.database.attendanceDay.groupBy({
            by: ['employeeId'],
            _sum: { notWorkingSeconds: true },
            _count: true,
            orderBy: { _sum: { notWorkingSeconds: 'desc' } },
            take: 10,
        });
        const users = await this.database.user.findMany({
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
        const result = await this.database.attendanceDay.groupBy({
            by: ['employeeId'],
            _sum: { notWorkingSeconds: true },
            _count: true,
            orderBy: { _sum: { notWorkingSeconds: 'asc' } },
            take: 10,
        });
        const users = await this.database.user.findMany({
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
        const totalEmployees = await this.database.user.count({
            where: { active: true },
        });
        const totalAbsent = await this.database.attendanceDay.count({
            where: {
                workDate: date,
                status: 'ABSENT',
            },
        });
        const totalPartial = await this.database.attendanceDay.count({
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
                percentage: totalEmployees > 0 ? (totalPresent / totalEmployees) * 100 : 0,
                color: 'green',
            },
            {
                title: 'Absent',
                count: totalAbsent,
                percentage: totalEmployees > 0 ? (totalAbsent / totalEmployees) * 100 : 0,
                color: 'red',
            },
            {
                title: 'Partial',
                count: totalPartial,
                percentage: totalEmployees > 0 ? (totalPartial / totalEmployees) * 100 : 0,
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