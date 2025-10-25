import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface SalaryConfigDto {
  userId: number;
  basicSalary: number;
  otRate: number;
  allowance?: number;
  deduction?: number;
}

export interface EmployeeSalary {
  id: number;
  name: string;
  epfNo: string;
  jobPosition: string;
  basicSalary: number;
  otRate: number;
  allowance: number;
  deduction: number;
  totalLeaveDays: number;
  netSalary: number;
}

export interface SalaryCalculation {
  basicSalary: number;
  overtimeHours: number;
  overtimePay: number;
  allowance: number;
  deduction: number;
  totalLeaveDays: number;
  leaveDeductions: number;
  grossSalary: number;
  netSalary: number;
}

@Injectable()
export class SalaryService {
  constructor(private readonly db: DatabaseService) {}

  // Fetch all active employees with latest salary config
  // Fetch all active employees with latest salary config
// In salary.service.ts - update getAllEmployees method
async getAllEmployees(): Promise<EmployeeSalary[]> {
  try {
    console.log('🔍 [Backend] Starting to fetch employees...');
    
    const employees = await this.db.user.findMany({
      where: { active: true },
      include: {
        salaryConfigs: {
          orderBy: { effectiveFrom: 'desc' },
          take: 1,
        },
      },
    });

    console.log(`📊 [Backend] Raw database query result:`, {
      totalEmployees: employees.length,
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        epfNo: emp.epfNo,
        active: emp.active,
        salaryConfigsCount: emp.salaryConfigs.length,
        hasJobPosition: !!emp.jobPosition
      }))
    });

    // Check if we have any employees at all
    if (employees.length === 0) {
      console.log('❌ [Backend] No active employees found in database');
      return [];
    }

    const mappedEmployees = employees.map(emp => {
      const latestConfig = emp.salaryConfigs[0] || {
        basicSalary: 0,
        otRate: 0,
        allowance: 0,
        deduction: 0,
      };

      const netSalary =
        latestConfig.basicSalary +
        (latestConfig.allowance || 0) -
        (latestConfig.deduction || 0);

      const mappedEmployee = {
        id: emp.id,
        name: emp.name,
        epfNo: emp.epfNo || '',
        jobPosition: emp.jobPosition || '',
        basicSalary: latestConfig.basicSalary,
        otRate: latestConfig.otRate || 0,
        allowance: latestConfig.allowance || 0,
        deduction: latestConfig.deduction || 0,
        totalLeaveDays: 0,
        netSalary,
      };

      console.log(`👤 [Backend] Mapped employee:`, mappedEmployee);
      return mappedEmployee;
    });

    console.log(`✅ [Backend] Successfully mapped ${mappedEmployees.length} employees`);
    return mappedEmployees;
  } catch (error) {
    console.error('❌ [Backend] Error fetching employees:', error);
    return [];
  }
}

  // Save or update employee salary config
  async saveSalaryConfig(body: SalaryConfigDto) {
    try {
      const { userId, basicSalary, otRate, allowance = 0, deduction = 0 } = body;

      // Check if user exists
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Create new salary config
      const salaryConfig = await this.db.salaryConfig.create({
        data: {
          userId,
          basicSalary,
          otRate,
          allowance,
          deduction,
        },
      });

      return salaryConfig;
    } catch (error) {
      console.error('Error saving salary config:', error);
      throw new Error(`Failed to save salary configuration: ${error.message}`);
    }
  }

  // Calculate salary for employee for specific period
  async calculateSalary(userId: number, month: number, year: number): Promise<SalaryCalculation> {
    try {
      // Get user with latest salary config
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: {
          salaryConfigs: {
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      });

      if (!user || !user.salaryConfigs.length) {
        throw new Error('User or salary configuration not found');
      }

      const config = user.salaryConfigs[0];
      
      // Calculate overtime hours from attendance (simplified - you'll need to implement based on your attendance data)
      const overtimeHours = await this.calculateOvertimeHours(userId, month, year);
      
      // Calculate leave days (simplified - implement based on your leave system)
      const totalLeaveDays = await this.calculateLeaveDays(userId, month, year);

      // Calculations
      const overtimePay = overtimeHours * (config.otRate || 0);
      const leaveDeductions = (config.basicSalary / 30) * totalLeaveDays; // Simple per-day deduction
      const grossSalary = config.basicSalary + overtimePay + (config.allowance || 0);
      const netSalary = grossSalary - (config.deduction || 0) - leaveDeductions;

      return {
        basicSalary: config.basicSalary,
        overtimeHours,
        overtimePay,
        allowance: config.allowance || 0,
        deduction: config.deduction || 0,
        totalLeaveDays,
        leaveDeductions,
        grossSalary,
        netSalary: Math.max(0, netSalary), // Ensure non-negative
      };
    } catch (error) {
      console.error('Error calculating salary:', error);
      throw new Error(`Failed to calculate salary: ${error.message}`);
    }
  }

  // Generate and save salary record
  async generateSalaryForEmployee(userId: number, month: number, year: number) {
    try {
      const calculation = await this.calculateSalary(userId, month, year);

      // Check if record already exists
      const existingRecord = await this.db.salaryRecord.findFirst({
        where: {
          userId,
          month,
          year,
        },
      });

      if (existingRecord) {
        // Update existing record
        const updatedRecord = await this.db.salaryRecord.update({
          where: { id: existingRecord.id },
          data: {
            basicSalary: calculation.basicSalary,
            totalLeave: calculation.totalLeaveDays,
            leaveDeductions: calculation.leaveDeductions,
            overtimePay: calculation.overtimePay,
            netSalary: calculation.netSalary,
          },
        });
        return updatedRecord;
      }

      // Create new record
      const salaryRecord = await this.db.salaryRecord.create({
        data: {
          userId,
          month,
          year,
          basicSalary: calculation.basicSalary,
          totalLeave: calculation.totalLeaveDays,
          leaveDeductions: calculation.leaveDeductions,
          overtimePay: calculation.overtimePay,
          netSalary: calculation.netSalary,
        },
      });

      return salaryRecord;
    } catch (error) {
      console.error('Error generating salary record:', error);
      throw new Error(`Failed to generate salary record: ${error.message}`);
    }
  }

  // Helper method to calculate overtime hours (implement based on your attendance system)
  private async calculateOvertimeHours(userId: number, month: number, year: number): Promise<number> {
    // This is a simplified implementation
    // You should integrate with your actual attendance system
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: {
          attendanceDays: {
            where: {
              workDate: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
              },
            },
          },
        },
      });

      if (!user) return 0;

      // Calculate total overtime seconds and convert to hours
      const totalOvertimeSeconds = user.attendanceDays.reduce(
        (sum, day) => sum + (day.overtimeSeconds || 0),
        0
      );

      return totalOvertimeSeconds / 3600; // Convert seconds to hours
    } catch (error) {
      console.error('Error calculating overtime hours:', error);
      return 0;
    }
  }

  // Helper method to calculate leave days (implement based on your leave system)
  private async calculateLeaveDays(userId: number, month: number, year: number): Promise<number> {
    // This is a simplified implementation
    // You should integrate with your actual leave system
    try {
      const leaveRequests = await this.db.leave_request.findMany({
        where: {
          userId,
          status: 'APPROVED',
          dates: {
            some: {
              leaveDate: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
              },
            },
          },
        },
        include: {
          dates: true,
        },
      });

      let totalLeaveDays = 0;
      leaveRequests.forEach(request => {
        request.dates.forEach(date => {
          if (date.isHalfDay) {
            totalLeaveDays += 0.5;
          } else {
            totalLeaveDays += 1;
          }
        });
      });

      return totalLeaveDays;
    } catch (error) {
      console.error('Error calculating leave days:', error);
      return 0;
    }
  }

  // Get salary configuration for a specific user
  async getSalaryConfig(userId: number) {
    try {
      const config = await this.db.salaryConfig.findFirst({
        where: { userId },
        orderBy: { effectiveFrom: 'desc' },
      });

      return config;
    } catch (error) {
      console.error('Error fetching salary config:', error);
      throw new Error(`Failed to fetch salary configuration: ${error.message}`);
    }
  }

  // Get salary records for a specific user
  async getSalaryRecords(userId: number) {
    try {
      const records = await this.db.salaryRecord.findMany({
        where: { userId },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ],
      });

      return records;
    } catch (error) {
      console.error('Error fetching salary records:', error);
      throw new Error(`Failed to fetch salary records: ${error.message}`);
    }
  }

  // Get all salary records for a specific period
  async getSalaryRecordsByPeriod(month: number, year: number) {
    try {
      const records = await this.db.salaryRecord.findMany({
        where: {
          month,
          year
        },
        include: {
          user: {
            select: {
              name: true,
                epfNo: true, 
              jobPosition: true,
              employeeId: true,
            },
          },
        },
        orderBy: {
          user: {
            name: 'asc'
          }
        },
      });

      return records;
    } catch (error) {
      console.error('Error fetching salary records by period:', error);
      throw new Error(`Failed to fetch salary records: ${error.message}`);
    }
  }

  // Get salary calculation without saving
  async getSalaryCalculation(userId: number, month: number, year: number) {
    return this.calculateSalary(userId, month, year);
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Add this method to your SalaryService in salary.service.ts
async findUserByEmployeeId(employeeId: string) {
  try {
    console.log('🔍 [Service] Finding user by employeeId:', employeeId);
    
    const user = await this.db.user.findUnique({
      where: { employeeId },
      include: {
        salaryConfigs: {
          orderBy: { effectiveFrom: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      console.warn('⚠️ [Service] User not found with employeeId:', employeeId);
      return null;
    }

    const latestConfig = user.salaryConfigs[0] || {
      basicSalary: 0,
      otRate: 0,
      allowance: 0,
      deduction: 0,
    };

    const netSalary =
      latestConfig.basicSalary +
      (latestConfig.allowance || 0) -
      (latestConfig.deduction || 0);

    const employeeData = {
      id: user.id,
      name: user.name,
      epfNo: user.epfNo || '',
      jobPosition: user.jobPosition || '',
      basicSalary: latestConfig.basicSalary,
      otRate: latestConfig.otRate || 0,
      allowance: latestConfig.allowance || 0,
      deduction: latestConfig.deduction || 0,
      totalLeaveDays: 0,
      netSalary,
    };

    console.log('✅ [Service] User found by employeeId:', employeeData);
    return employeeData;
  } catch (error) {
    console.error('❌ [Service] Error finding user by employeeId:', error);
    throw error;
  }
}
}

