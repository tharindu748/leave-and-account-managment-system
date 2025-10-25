import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: DatabaseService) {}

  // 🔸 Most late employees (descending by notWorkingSeconds)
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
      late: Math.round((r._sum.notWorkingSeconds || 0) / 60), // convert seconds → minutes
      workingDays: r._count,
    }));
  }

  // 🔸 Least late employees (ascending order)
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

  // 🔸 Daily summary for dashboard cards
  async getSummary(date: Date) {
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
}
