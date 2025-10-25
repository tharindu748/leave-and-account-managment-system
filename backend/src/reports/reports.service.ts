import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportsService {
  constructor(private database: DatabaseService) {}

  async getEmployeeDashboardData(userId: number) {
    console.log('🔄 Getting dashboard data for user:', userId);

    // Check if the specific user exists
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

    // If user exists, get real data - user is now guaranteed to be non-null
    const workedSinceJoining = this.calculateWorkedDays(user.createdAt);

    // Get leave data - FIXED: Use proper leave balance calculation
    const leaveData = await this.getLeaveData(userId);

    // Get work hours for current month
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

  private getMockData(userId: number) {
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

  // private calculateWorkedDays(joinDate: Date): number {
  //   const today = new Date();
  //   const diffTime = Math.abs(today.getTime() - joinDate.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // }

    private calculateWorkedDays(joinDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  private async getLeaveData(userId: number) {
    const currentYear = new Date().getFullYear();
    
    // Get leave balances from Leave_balance model
    const leaveBalances = await this.database.leave_balance.findMany({
      where: {
        userId: userId,
        year: currentYear,
      },
    });

    // Get approved leave requests for current year to calculate taken leaves
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

    // Calculate leave counts from approved requests
    let sickLeave = 0;
    let annualLeave = 0;

    approvedLeaves.forEach(request => {
      const days = request.dates.reduce((total, date) => {
        return total + (date.isHalfDay ? 0.5 : 1);
      }, 0);

      if (request.leaveType === 'CASUAL') {
        sickLeave += days;
      } else if (request.leaveType === 'ANNUAL') {
        annualLeave += days;
      }
    });

    const totalLeave = sickLeave + annualLeave;

    // Get default balances from leave policies
    const leavePolicies = await this.database.leave_policy.findMany();
    
    // Calculate remaining holidays based on leave balances
    const annualBalance = leaveBalances.find(lb => lb.leaveType === 'ANNUAL')?.balance || 0;
    const casualBalance = leaveBalances.find(lb => lb.leaveType === 'CASUAL')?.balance || 0;
    
    // If no balances exist, use default policies
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

  private async getWorkHoursThisMonth(userId: number): Promise<number> {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get user to find employeeId for attendance lookup
    const user = await this.database.user.findUnique({
      where: { id: userId },
      select: { employeeId: true }
    });

    if (!user?.employeeId) return 0;

    // Get attendance days for current month using employeeId
    const attendanceDays = await this.database.attendanceDay.findMany({
      where: {
        employeeId: user.employeeId,
        workDate: {
          gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`),
          lte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`),
        },
      },
    });

    // Calculate total work hours (convert seconds to hours)
    const totalSeconds = attendanceDays.reduce((sum, day) => sum + day.workedSeconds, 0);
    const totalHours = Math.round(totalSeconds / 3600);
    
    return totalHours;
  }

  // 🔸 Most late employees (descending by notWorkingSeconds)
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
      late: Math.round((r._sum.notWorkingSeconds || 0) / 60), // convert seconds → minutes
      workingDays: r._count,
    }));
  }

  // 🔸 Least late employees (ascending order)
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

  // 🔸 Daily summary for dashboard cards
  async getSummary(date: Date) {
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
}