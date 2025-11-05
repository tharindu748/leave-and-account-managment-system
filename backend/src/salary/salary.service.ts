// import { Injectable } from '@nestjs/common';
// import { DatabaseService } from '../database/database.service';

// export interface SalaryConfigDto {
//   userId: number;
//   basicSalary: number;
//   otRate: number;
//   allowance?: number;
//   deduction?: number;
// }

// export interface EmployeeSalary {
//   id: number;
//   name: string;
//   epfNo: string;
//   jobPosition: string;
//   basicSalary: number;
//   otRate: number;
//   allowance: number;
//   deduction: number;
//   totalLeaveDays: number;
//   netSalary: number;
// }

// export interface SalaryCalculation {
//   basicSalary: number;
//   overtimeHours: number;
//   overtimePay: number;
//   allowance: number;
//   deduction: number;
//   totalLeaveDays: number;
//   leaveDeductions: number;
//   grossSalary: number;
//   netSalary: number;
// }

// @Injectable()
// export class SalaryService {
//   constructor(private readonly db: DatabaseService) {}

//   // Fetch all active employees with latest salary config
//   // Fetch all active employees with latest salary config
// // In salary.service.ts - update getAllEmployees method
// async getAllEmployees(): Promise<EmployeeSalary[]> {
//   try {
//     console.log('🔍 [Backend] Starting to fetch employees...');
    
//     const employees = await this.db.user.findMany({
//       where: { active: true },
//       include: {
//         salaryConfigs: {
//           orderBy: { effectiveFrom: 'desc' },
//           take: 1,
//         },
//       },
//     });

//     console.log(`📊 [Backend] Raw database query result:`, {
//       totalEmployees: employees.length,
//       employees: employees.map(emp => ({
//         id: emp.id,
//         name: emp.name,
//         epfNo: emp.epfNo,
//         active: emp.active,
//         salaryConfigsCount: emp.salaryConfigs.length,
//         hasJobPosition: !!emp.jobPosition
//       }))
//     });

//     // Check if we have any employees at all
//     if (employees.length === 0) {
//       console.log('❌ [Backend] No active employees found in database');
//       return [];
//     }

//     const mappedEmployees = employees.map(emp => {
//       const latestConfig = emp.salaryConfigs[0] || {
//         basicSalary: 0,
//         otRate: 0,
//         allowance: 0,
//         deduction: 0,
//       };

//       const netSalary =
//         latestConfig.basicSalary +
//         (latestConfig.allowance || 0) -
//         (latestConfig.deduction || 0);

//       const mappedEmployee = {
//         id: emp.id,
//         name: emp.name,
//         epfNo: emp.epfNo || '',
//         jobPosition: emp.jobPosition || '',
//         basicSalary: latestConfig.basicSalary,
//         otRate: latestConfig.otRate || 0,
//         allowance: latestConfig.allowance || 0,
//         deduction: latestConfig.deduction || 0,
//         totalLeaveDays: 0,
//         netSalary,
//       };

//       console.log(`👤 [Backend] Mapped employee:`, mappedEmployee);
//       return mappedEmployee;
//     });

//     console.log(`✅ [Backend] Successfully mapped ${mappedEmployees.length} employees`);
//     return mappedEmployees;
//   } catch (error) {
//     console.error('❌ [Backend] Error fetching employees:', error);
//     return [];
//   }
// }

//   // Save or update employee salary config
//   async saveSalaryConfig(body: SalaryConfigDto) {
//     try {
//       const { userId, basicSalary, otRate, allowance = 0, deduction = 0 } = body;

//       // Check if user exists
//       const user = await this.db.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         throw new Error(`User with ID ${userId} not found`);
//       }

//       // Create new salary config
//       const salaryConfig = await this.db.salaryConfig.create({
//         data: {
//           userId,
//           basicSalary,
//           otRate,
//           allowance,
//           deduction,
//         },
//       });

//       return salaryConfig;
//     } catch (error) {
//       console.error('Error saving salary config:', error);
//       throw new Error(`Failed to save salary configuration: ${error.message}`);
//     }
//   }

//   // Calculate salary for employee for specific period
//   async calculateSalary(userId: number, month: number, year: number): Promise<SalaryCalculation> {
//     try {
//       // Get user with latest salary config
//       const user = await this.db.user.findUnique({
//         where: { id: userId },
//         include: {
//           salaryConfigs: {
//             orderBy: { effectiveFrom: 'desc' },
//             take: 1,
//           },
//         },
//       });

//       if (!user || !user.salaryConfigs.length) {
//         throw new Error('User or salary configuration not found');
//       }

//       const config = user.salaryConfigs[0];
      
//       // Calculate overtime hours from attendance (simplified - you'll need to implement based on your attendance data)
//       const overtimeHours = await this.calculateOvertimeHours(userId, month, year);
      
//       // Calculate leave days (simplified - implement based on your leave system)
//       const totalLeaveDays = await this.calculateLeaveDays(userId, month, year);

//       // Calculations
//       const overtimePay = overtimeHours * (config.otRate || 0);
//       const leaveDeductions = (config.basicSalary / 30) * totalLeaveDays; // Simple per-day deduction
//       const grossSalary = config.basicSalary + overtimePay + (config.allowance || 0);
//       const netSalary = grossSalary - (config.deduction || 0) - leaveDeductions;

//       return {
//         basicSalary: config.basicSalary,
//         overtimeHours,
//         overtimePay,
//         allowance: config.allowance || 0,
//         deduction: config.deduction || 0,
//         totalLeaveDays,
//         leaveDeductions,
//         grossSalary,
//         netSalary: Math.max(0, netSalary), // Ensure non-negative
//       };
//     } catch (error) {
//       console.error('Error calculating salary:', error);
//       throw new Error(`Failed to calculate salary: ${error.message}`);
//     }
//   }

//   // Generate and save salary record
//   async generateSalaryForEmployee(userId: number, month: number, year: number) {
//     try {
//       const calculation = await this.calculateSalary(userId, month, year);

//       // Check if record already exists
//       const existingRecord = await this.db.salaryRecord.findFirst({
//         where: {
//           userId,
//           month,
//           year,
//         },
//       });

//       if (existingRecord) {
//         // Update existing record
//         const updatedRecord = await this.db.salaryRecord.update({
//           where: { id: existingRecord.id },
//           data: {
//             basicSalary: calculation.basicSalary,
//             totalLeave: calculation.totalLeaveDays,
//             leaveDeductions: calculation.leaveDeductions,
//             overtimePay: calculation.overtimePay,
//             netSalary: calculation.netSalary,
//           },
//         });
//         return updatedRecord;
//       }

//       // Create new record
//       const salaryRecord = await this.db.salaryRecord.create({
//         data: {
//           userId,
//           month,
//           year,
//           basicSalary: calculation.basicSalary,
//           totalLeave: calculation.totalLeaveDays,
//           leaveDeductions: calculation.leaveDeductions,
//           overtimePay: calculation.overtimePay,
//           netSalary: calculation.netSalary,
//         },
//       });

//       return salaryRecord;
//     } catch (error) {
//       console.error('Error generating salary record:', error);
//       throw new Error(`Failed to generate salary record: ${error.message}`);
//     }
//   }

//   // Helper method to calculate overtime hours (implement based on your attendance system)
//   private async calculateOvertimeHours(userId: number, month: number, year: number): Promise<number> {
//     // This is a simplified implementation
//     // You should integrate with your actual attendance system
//     try {
//       const user = await this.db.user.findUnique({
//         where: { id: userId },
//         include: {
//           attendanceDays: {
//             where: {
//               workDate: {
//                 gte: new Date(year, month - 1, 1),
//                 lt: new Date(year, month, 1),
//               },
//             },
//           },
//         },
//       });

//       if (!user) return 0;

//       // Calculate total overtime seconds and convert to hours
//       const totalOvertimeSeconds = user.attendanceDays.reduce(
//         (sum, day) => sum + (day.overtimeSeconds || 0),
//         0
//       );

//       return totalOvertimeSeconds / 3600; // Convert seconds to hours
//     } catch (error) {
//       console.error('Error calculating overtime hours:', error);
//       return 0;
//     }
//   }

//   // Helper method to calculate leave days (implement based on your leave system)
//   private async calculateLeaveDays(userId: number, month: number, year: number): Promise<number> {
//     // This is a simplified implementation
//     // You should integrate with your actual leave system
//     try {
//       const leaveRequests = await this.db.leave_request.findMany({
//         where: {
//           userId,
//           status: 'APPROVED',
//           dates: {
//             some: {
//               leaveDate: {
//                 gte: new Date(year, month - 1, 1),
//                 lt: new Date(year, month, 1),
//               },
//             },
//           },
//         },
//         include: {
//           dates: true,
//         },
//       });

//       let totalLeaveDays = 0;
//       leaveRequests.forEach(request => {
//         request.dates.forEach(date => {
//           if (date.isHalfDay) {
//             totalLeaveDays += 0.5;
//           } else {
//             totalLeaveDays += 1;
//           }
//         });
//       });

//       return totalLeaveDays;
//     } catch (error) {
//       console.error('Error calculating leave days:', error);
//       return 0;
//     }
//   }

//   // Get salary configuration for a specific user
//   async getSalaryConfig(userId: number) {
//     try {
//       const config = await this.db.salaryConfig.findFirst({
//         where: { userId },
//         orderBy: { effectiveFrom: 'desc' },
//       });

//       return config;
//     } catch (error) {
//       console.error('Error fetching salary config:', error);
//       throw new Error(`Failed to fetch salary configuration: ${error.message}`);
//     }
//   }

//   // Get salary records for a specific user
//   async getSalaryRecords(userId: number) {
//     try {
//       const records = await this.db.salaryRecord.findMany({
//         where: { userId },
//         orderBy: [
//           { year: 'desc' },
//           { month: 'desc' }
//         ],
//       });

//       return records;
//     } catch (error) {
//       console.error('Error fetching salary records:', error);
//       throw new Error(`Failed to fetch salary records: ${error.message}`);
//     }
//   }

//   // Get all salary records for a specific period
//   async getSalaryRecordsByPeriod(month: number, year: number) {
//     try {
//       const records = await this.db.salaryRecord.findMany({
//         where: {
//           month,
//           year
//         },
//         include: {
//           user: {
//             select: {
//               name: true,
//                 epfNo: true, 
//               jobPosition: true,
//               employeeId: true,
//             },
//           },
//         },
//         orderBy: {
//           user: {
//             name: 'asc'
//           }
//         },
//       });

//       return records;
//     } catch (error) {
//       console.error('Error fetching salary records by period:', error);
//       throw new Error(`Failed to fetch salary records: ${error.message}`);
//     }
//   }

//   // Get salary calculation without saving
//   async getSalaryCalculation(userId: number, month: number, year: number) {
//     return this.calculateSalary(userId, month, year);
//   }

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   // Add this method to your SalaryService in salary.service.ts
// async findUserByEmployeeId(employeeId: string) {
//   try {
//     console.log('🔍 [Service] Finding user by employeeId:', employeeId);
    
//     const user = await this.db.user.findUnique({
//       where: { employeeId },
//       include: {
//         salaryConfigs: {
//           orderBy: { effectiveFrom: 'desc' },
//           take: 1,
//         },
//       },
//     });

//     if (!user) {
//       console.warn('⚠️ [Service] User not found with employeeId:', employeeId);
//       return null;
//     }

//     const latestConfig = user.salaryConfigs[0] || {
//       basicSalary: 0,
//       otRate: 0,
//       allowance: 0,
//       deduction: 0,
//     };

//     const netSalary =
//       latestConfig.basicSalary +
//       (latestConfig.allowance || 0) -
//       (latestConfig.deduction || 0);

//     const employeeData = {
//       id: user.id,
//       name: user.name,
//       epfNo: user.epfNo || '',
//       jobPosition: user.jobPosition || '',
//       basicSalary: latestConfig.basicSalary,
//       otRate: latestConfig.otRate || 0,
//       allowance: latestConfig.allowance || 0,
//       deduction: latestConfig.deduction || 0,
//       totalLeaveDays: 0,
//       netSalary,
//     };

//     console.log('✅ [Service] User found by employeeId:', employeeData);
//     return employeeData;
//   } catch (error) {
//     console.error('❌ [Service] Error finding user by employeeId:', error);
//     throw error;
//   }
// }
// }

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

// DTOs for Comprehensive Salary Setup
export interface SalarySetupDto {
  userId: number;
  basicSalary: number;
  otRate?: number;
  regulatoryAllowance?: number;
  tasksAllowance1?: number;
  tasksAllowance2?: number;
  tasksAllowance3?: number;
  tasksAllowance4?: number;
  tasksAllowance5?: number;
  perDayRate?: number;
  latePerDayRate?: number;
  paymentMethod?: string;
  paymentFrequency?: string;
  salaryDaysCalculation?: string;
  epfPercentage?: number;
  etfPercentage?: number;
  taxPercentage?: number;
}

export interface EmployeeSalarySetup {
  id: number;
  name: string;
  epfNo: string;
  jobPosition: string;
  basicSalary: number;
  otRate: number;
  regulatoryAllowance: number;
  tasksAllowance1: number;
  tasksAllowance2: number;
  tasksAllowance3: number;
  tasksAllowance4: number;
  tasksAllowance5: number;
  perDayRate: number;
  latePerDayRate: number;
  paymentMethod: string;
  paymentFrequency: string;
  salaryDaysCalculation: string;
  epfPercentage: number;
  etfPercentage: number;
  taxPercentage: number;
  totalAllowances: number;
  grossSalary: number;
}

export interface ComprehensiveSalaryCalculation {
  basicSalary: number;
  totalAllowances: number;
  overtimeHours: number;
  overtimePay: number;
  leaveDays: number;
  leaveDeductions: number;
  workingDays: number;
  grossSalary: number;
  deductions: {
    epf: number;
    etf: number;
    tax: number;
    leave: number;
    total: number;
  };
  netSalary: number;
  components: {
    basic: number;
    allowances: number;
    overtime: number;
    deductions: number;
  };
}

// Keep existing DTOs for backward compatibility
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

  // ==================== COMPREHENSIVE SALARY SETUP METHODS ====================

  /**
   * Get all employees with comprehensive salary setup
   */
  async getAllEmployeesWithSalarySetup(): Promise<EmployeeSalarySetup[]> {
    try {
      console.log('🔍 [Backend] Starting to fetch employees with comprehensive salary setup...');
      
      const employees = await this.db.user.findMany({
        where: { active: true },
        include: {
          salarySetups: {
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      });

      console.log(`📊 [Backend] Comprehensive salary setup query result:`, {
        totalEmployees: employees.length,
        employeesWithSetup: employees.filter(emp => emp.salarySetups.length > 0).length
      });

      if (employees.length === 0) {
        console.log('❌ [Backend] No active employees found in database');
        return [];
      }

      const mappedEmployees = employees.map(emp => {
        const latestSetup = emp.salarySetups[0] || this.getDefaultSalarySetup();
        
        const totalAllowances = 
          (latestSetup.regulatoryAllowance || 0) +
          (latestSetup.tasksAllowance1 || 0) +
          (latestSetup.tasksAllowance2 || 0) +
          (latestSetup.tasksAllowance3 || 0) +
          (latestSetup.tasksAllowance4 || 0) +
          (latestSetup.tasksAllowance5 || 0);

        const grossSalary = latestSetup.basicSalary + totalAllowances;

        const employeeSetup = {
          id: emp.id,
          name: emp.name,
          epfNo: emp.epfNo || '',
          jobPosition: emp.jobPosition || '',
          basicSalary: latestSetup.basicSalary,
          otRate: latestSetup.otRate || 0,
          regulatoryAllowance: latestSetup.regulatoryAllowance || 0,
          tasksAllowance1: latestSetup.tasksAllowance1 || 0,
          tasksAllowance2: latestSetup.tasksAllowance2 || 0,
          tasksAllowance3: latestSetup.tasksAllowance3 || 0,
          tasksAllowance4: latestSetup.tasksAllowance4 || 0,
          tasksAllowance5: latestSetup.tasksAllowance5 || 0,
          perDayRate: latestSetup.perDayRate || 0,
          latePerDayRate: latestSetup.latePerDayRate || 0,
          paymentMethod: latestSetup.paymentMethod || 'cash',
          paymentFrequency: latestSetup.paymentFrequency || 'monthly',
          salaryDaysCalculation: latestSetup.salaryDaysCalculation || 'calendar',
          epfPercentage: latestSetup.epfPercentage || 0,
          etfPercentage: latestSetup.etfPercentage || 0,
          taxPercentage: latestSetup.taxPercentage || 0,
          totalAllowances,
          grossSalary,
        };

        console.log(`👤 [Backend] Comprehensive employee setup:`, employeeSetup);
        return employeeSetup;
      });

      console.log(`✅ [Backend] Successfully mapped ${mappedEmployees.length} employees with comprehensive setup`);
      return mappedEmployees;
    } catch (error) {
      console.error('❌ [Backend] Error fetching employees with comprehensive setup:', error);
      return [];
    }
  }

  /**
   * Get comprehensive salary setup for specific employee
   */
  async getEmployeeSalarySetup(employeeId: string): Promise<EmployeeSalarySetup | null> {
    try {
      console.log('🔍 [Service] Finding comprehensive salary setup for employee:', employeeId);
      
      const user = await this.db.user.findUnique({
        where: { employeeId },
        include: {
          salarySetups: {
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      });

      if (!user) {
        console.warn('⚠️ [Service] User not found with employeeId:', employeeId);
        return null;
      }

      const latestSetup = user.salarySetups[0] || this.getDefaultSalarySetup();
      
      const totalAllowances = 
        (latestSetup.regulatoryAllowance || 0) +
        (latestSetup.tasksAllowance1 || 0) +
        (latestSetup.tasksAllowance2 || 0) +
        (latestSetup.tasksAllowance3 || 0) +
        (latestSetup.tasksAllowance4 || 0) +
        (latestSetup.tasksAllowance5 || 0);

      const grossSalary = latestSetup.basicSalary + totalAllowances;

      const employeeSetup = {
        id: user.id,
        name: user.name,
        epfNo: user.epfNo || '',
        jobPosition: user.jobPosition || '',
        basicSalary: latestSetup.basicSalary,
        otRate: latestSetup.otRate || 0,
        regulatoryAllowance: latestSetup.regulatoryAllowance || 0,
        tasksAllowance1: latestSetup.tasksAllowance1 || 0,
        tasksAllowance2: latestSetup.tasksAllowance2 || 0,
        tasksAllowance3: latestSetup.tasksAllowance3 || 0,
        tasksAllowance4: latestSetup.tasksAllowance4 || 0,
        tasksAllowance5: latestSetup.tasksAllowance5 || 0,
        perDayRate: latestSetup.perDayRate || 0,
        latePerDayRate: latestSetup.latePerDayRate || 0,
        paymentMethod: latestSetup.paymentMethod || 'cash',
        paymentFrequency: latestSetup.paymentFrequency || 'monthly',
        salaryDaysCalculation: latestSetup.salaryDaysCalculation || 'calendar',
        epfPercentage: latestSetup.epfPercentage || 0,
        etfPercentage: latestSetup.etfPercentage || 0,
        taxPercentage: latestSetup.taxPercentage || 0,
        totalAllowances,
        grossSalary,
      };

      console.log('✅ [Service] Comprehensive salary setup found:', employeeSetup);
      return employeeSetup;
    } catch (error) {
      console.error('❌ [Service] Error getting comprehensive salary setup:', error);
      throw error;
    }
  }

  /**
   * Save comprehensive salary setup
   */
  async saveSalarySetup(dto: SalarySetupDto) {
    try {
      console.log('💾 [Service] Saving comprehensive salary setup for user:', dto.userId);
      
      // Check if user exists
      const user = await this.db.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new Error(`User with ID ${dto.userId} not found`);
      }

      const salarySetup = await this.db.salarySetup.create({
        data: {
          userId: dto.userId,
          basicSalary: dto.basicSalary,
          otRate: dto.otRate,
          regulatoryAllowance: dto.regulatoryAllowance,
          tasksAllowance1: dto.tasksAllowance1,
          tasksAllowance2: dto.tasksAllowance2,
          tasksAllowance3: dto.tasksAllowance3,
          tasksAllowance4: dto.tasksAllowance4,
          tasksAllowance5: dto.tasksAllowance5,
          perDayRate: dto.perDayRate,
          latePerDayRate: dto.latePerDayRate,
          paymentMethod: dto.paymentMethod,
          paymentFrequency: dto.paymentFrequency,
          salaryDaysCalculation: dto.salaryDaysCalculation,
          epfPercentage: dto.epfPercentage,
          etfPercentage: dto.etfPercentage,
          taxPercentage: dto.taxPercentage,
        },
      });

      console.log('✅ [Service] Comprehensive salary setup saved successfully');
      return salarySetup;
    } catch (error) {
      console.error('❌ [Service] Error saving comprehensive salary setup:', error);
      throw new Error(`Failed to save salary setup: ${error.message}`);
    }
  }

  /**
   * Calculate comprehensive salary with all components
   */
  async calculateComprehensiveSalary(userId: number, month: number, year: number): Promise<ComprehensiveSalaryCalculation> {
    try {
      console.log(`🧮 [Service] Calculating comprehensive salary for user ${userId}, ${month}/${year}`);
      
      const user = await this.db.user.findUnique({
        where: { id: userId },
        include: {
          salarySetups: {
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
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

      if (!user || !user.salarySetups.length) {
        throw new Error('User or salary setup not found');
      }

      const setup = user.salarySetups[0];
      const overtimeHours = await this.calculateOvertimeHours(userId, month, year);
      const leaveDays = await this.calculateLeaveDays(userId, month, year);
      const workingDays = await this.calculateWorkingDays(userId, month, year);

      // Calculations
      const overtimePay = overtimeHours * (setup.otRate || 0);
      const totalAllowances = 
        (setup.regulatoryAllowance || 0) +
        (setup.tasksAllowance1 || 0) +
        (setup.tasksAllowance2 || 0) +
        (setup.tasksAllowance3 || 0) +
        (setup.tasksAllowance4 || 0) +
        (setup.tasksAllowance5 || 0);

      const dailyRate = setup.basicSalary / 30;
      const leaveDeductions = dailyRate * leaveDays;
      
      const grossSalary = setup.basicSalary + totalAllowances + overtimePay;
      
      // Statutory deductions
      const epfDeduction = grossSalary * ((setup.epfPercentage || 0) / 100);
      const etfDeduction = grossSalary * ((setup.etfPercentage || 0) / 100);
      const taxDeduction = grossSalary * ((setup.taxPercentage || 0) / 100);
      
      const totalDeductions = leaveDeductions + epfDeduction + etfDeduction + taxDeduction;
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      const calculation = {
        basicSalary: setup.basicSalary,
        totalAllowances,
        overtimeHours,
        overtimePay,
        leaveDays,
        leaveDeductions,
        workingDays,
        grossSalary,
        deductions: {
          epf: epfDeduction,
          etf: etfDeduction,
          tax: taxDeduction,
          leave: leaveDeductions,
          total: totalDeductions,
        },
        netSalary,
        components: {
          basic: setup.basicSalary,
          allowances: totalAllowances,
          overtime: overtimePay,
          deductions: totalDeductions,
        }
      };

      console.log('✅ [Service] Comprehensive salary calculation completed:', calculation);
      return calculation;
    } catch (error) {
      console.error('❌ [Service] Error calculating comprehensive salary:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive salary record with components breakdown
   */
  async generateComprehensiveSalaryRecord(userId: number, month: number, year: number) {
    try {
      console.log(`📊 [Service] Generating comprehensive salary record for user ${userId}, ${month}/${year}`);
      
      const calculation = await this.calculateComprehensiveSalary(userId, month, year);

      // Create salary record
      const salaryRecord = await this.db.salaryRecord.create({
        data: {
          userId,
          month,
          year,
          basicSalary: calculation.basicSalary,
          totalLeave: calculation.leaveDays,
          leaveDeductions: calculation.deductions.leave,
          overtimePay: calculation.overtimePay,
          netSalary: calculation.netSalary,
        },
      });

      // Create salary components breakdown
      await this.db.salaryComponent.createMany({
        data: [
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'basic',
            description: 'Basic Salary',
            amount: calculation.components.basic,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'allowance',
            description: 'Total Allowances',
            amount: calculation.components.allowances,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'overtime',
            description: 'Overtime Pay',
            amount: calculation.components.overtime,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'deduction',
            description: 'Total Deductions',
            amount: calculation.components.deductions,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'epf',
            description: 'EPF Deduction',
            amount: calculation.deductions.epf,
            percentage: calculation.deductions.epf / calculation.grossSalary * 100,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'etf',
            description: 'ETF Deduction',
            amount: calculation.deductions.etf,
            percentage: calculation.deductions.etf / calculation.grossSalary * 100,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'tax',
            description: 'Tax Deduction',
            amount: calculation.deductions.tax,
            percentage: calculation.deductions.tax / calculation.grossSalary * 100,
          },
          {
            salaryRecordId: salaryRecord.id,
            componentType: 'leave',
            description: 'Leave Deductions',
            amount: calculation.deductions.leave,
          },
        ],
      });

      console.log('✅ [Service] Comprehensive salary record generated successfully');
      return { salaryRecord, calculation };
    } catch (error) {
      console.error('❌ [Service] Error generating comprehensive salary record:', error);
      throw error;
    }
  }

  // ==================== EXISTING METHODS (BACKWARD COMPATIBILITY) ====================

  /**
   * Get all employees with basic salary config (existing method)
   */
  async getAllEmployees(): Promise<EmployeeSalary[]> {
    try {
      console.log('🔍 [Backend] Starting to fetch employees with basic config...');
      
      const employees = await this.db.user.findMany({
        where: { active: true },
        include: {
          salaryConfigs: {
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      });

      console.log(`📊 [Backend] Basic config query result:`, {
        totalEmployees: employees.length,
        employeesWithConfig: employees.filter(emp => emp.salaryConfigs.length > 0).length
      });

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

        return mappedEmployee;
      });

      console.log(`✅ [Backend] Successfully mapped ${mappedEmployees.length} employees with basic config`);
      return mappedEmployees;
    } catch (error) {
      console.error('❌ [Backend] Error fetching employees:', error);
      return [];
    }
  }

  /**
   * Save basic salary config (existing method)
   */
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

  /**
   * Calculate basic salary (existing method)
   */
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
      
      // Calculate overtime hours from attendance
      const overtimeHours = await this.calculateOvertimeHours(userId, month, year);
      
      // Calculate leave days
      const totalLeaveDays = await this.calculateLeaveDays(userId, month, year);

      // Calculations
      const overtimePay = overtimeHours * (config.otRate || 0);
      const leaveDeductions = (config.basicSalary / 30) * totalLeaveDays;
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
        netSalary: Math.max(0, netSalary),
      };
    } catch (error) {
      console.error('Error calculating salary:', error);
      throw new Error(`Failed to calculate salary: ${error.message}`);
    }
  }

  /**
   * Generate and save basic salary record (existing method)
   */
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

  // ==================== HELPER METHODS ====================

  /**
   * Get default salary setup template
   */
  private getDefaultSalarySetup() {
    return {
      basicSalary: 0,
      otRate: 0,
      regulatoryAllowance: 0,
      tasksAllowance1: 0,
      tasksAllowance2: 0,
      tasksAllowance3: 0,
      tasksAllowance4: 0,
      tasksAllowance5: 0,
      perDayRate: 0,
      latePerDayRate: 0,
      paymentMethod: 'cash',
      paymentFrequency: 'monthly',
      salaryDaysCalculation: 'calendar',
      epfPercentage: 0,
      etfPercentage: 0,
      taxPercentage: 0,
    };
  }

  /**
   * Calculate overtime hours
   */
  private async calculateOvertimeHours(userId: number, month: number, year: number): Promise<number> {
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

      const totalOvertimeSeconds = user.attendanceDays.reduce(
        (sum, day) => sum + (day.overtimeSeconds || 0),
        0
      );

      return totalOvertimeSeconds / 3600;
    } catch (error) {
      console.error('Error calculating overtime hours:', error);
      return 0;
    }
  }

  /**
   * Calculate leave days
   */
  private async calculateLeaveDays(userId: number, month: number, year: number): Promise<number> {
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

  /**
   * Calculate working days
   */
  private async calculateWorkingDays(userId: number, month: number, year: number): Promise<number> {
    try {
      const attendanceDays = await this.db.attendanceDay.findMany({
        where: {
          employeeId: userId.toString(),
          workDate: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
          status: {
            in: ['OK', 'PARTIAL', 'MANUAL']
          }
        },
      });

      return attendanceDays.length;
    } catch (error) {
      console.error('Error calculating working days:', error);
      return 22; // Default fallback
    }
  }

  // ==================== EXISTING HELPER METHODS ====================

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

  async getSalaryCalculation(userId: number, month: number, year: number) {
    return this.calculateSalary(userId, month, year);
  }

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