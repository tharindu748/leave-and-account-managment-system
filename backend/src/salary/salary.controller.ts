
// import { 
//   Controller, 
//   Get, 
//   Post, 
//   Body, 
//   HttpException, 
//   HttpStatus, 
//   Param, 
//   Query,
//   Res 
// } from '@nestjs/common';
// import type { Response } from 'express'; // ✅ Use import type
// import { SalaryService, EmployeeSalary } from './salary.service';
// import type { SalaryConfigDto } from './salary.service';

// @Controller('salary')
// export class SalaryController {
//   constructor(private readonly salaryService: SalaryService) {}

//   // GET /salary/employees - Get all employees with salary configs
//   @Get('employees')
//   async getEmployees(): Promise<EmployeeSalary[]> {
//     try {
//       return await this.salaryService.getAllEmployees();
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to fetch employees',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Get('test')
//   async test() {
//     console.log('✅ Test endpoint hit!');
//     return { message: 'API is working!', timestamp: new Date() };
//   }

//   // POST /salary/config - Save salary configuration
//   @Post('config')
//   async saveSalary(@Body() body: SalaryConfigDto) {
//     try {
//       if (!body.userId || body.basicSalary === undefined) {
//         throw new HttpException(
//           'userId and basicSalary are required fields',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       if (body.basicSalary < 0) {
//         throw new HttpException(
//           'Basic salary cannot be negative',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       const result = await this.salaryService.saveSalaryConfig(body);
//       return {
//         status: 'success',
//         message: 'Salary configuration saved successfully',
//         data: result,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to save salary configuration',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // GET /salary/config/:userId - Get salary config for user
//   @Get('config/:userId')
//   async getSalaryConfig(@Param('userId') userId: string) {
//     try {
//       const userIdNum = parseInt(userId);
//       if (isNaN(userIdNum)) {
//         throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
//       }

//       const config = await this.salaryService.getSalaryConfig(userIdNum);
//       return {
//         status: 'success',
//         data: config,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to fetch salary configuration',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // GET /salary/calculate/:userId/:month/:year - Calculate salary without saving
//   @Get('calculate/:userId/:month/:year')
//   async calculateSalary(
//     @Param('userId') userId: string,
//     @Param('month') month: string,
//     @Param('year') year: string,
//   ) {
//     try {
//       const userIdNum = parseInt(userId);
//       const monthNum = parseInt(month);
//       const yearNum = parseInt(year);

//       if (isNaN(userIdNum) || isNaN(monthNum) || isNaN(yearNum)) {
//         throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
//       }

//       if (monthNum < 1 || monthNum > 12) {
//         throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
//       }

//       const calculation = await this.salaryService.getSalaryCalculation(userIdNum, monthNum, yearNum);
//       return {
//         status: 'success',
//         data: calculation,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to calculate salary',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // POST /salary/generate - Generate and save salary record
//   @Post('generate')
//   async generateSalaryRecord(
//     @Body('userId') userId: number,
//     @Body('month') month: number,
//     @Body('year') year: number,
//   ) {
//     try {
//       if (!userId || !month || !year) {
//         throw new HttpException(
//           'userId, month, and year are required fields',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       if (month < 1 || month > 12) {
//         throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
//       }

//       const result = await this.salaryService.generateSalaryForEmployee(userId, month, year);
//       return {
//         status: 'success',
//         message: 'Salary record generated successfully',
//         data: result,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to generate salary record',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // GET /salary/records/:userId - Get salary records for user
//   @Get('records/:userId')
//   async getSalaryRecords(@Param('userId') userId: string) {
//     try {
//       const userIdNum = parseInt(userId);
//       if (isNaN(userIdNum)) {
//         throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
//       }

//       const records = await this.salaryService.getSalaryRecords(userIdNum);
//       return {
//         status: 'success',
//         data: records,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to fetch salary records',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // GET /salary/period/:month/:year - Get salary records for period
//   @Get('period/:month/:year')
//   async getSalaryRecordsByPeriod(
//     @Param('month') month: string,
//     @Param('year') year: string,
//   ) {
//     try {
//       const monthNum = parseInt(month);
//       const yearNum = parseInt(year);

//       if (isNaN(monthNum) || isNaN(yearNum)) {
//         throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
//       }

//       if (monthNum < 1 || monthNum > 12) {
//         throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
//       }

//       const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
//       return {
//         status: 'success',
//         data: records,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to fetch salary records for period',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   // GET /salary/period - Get salary records with optional month/year filter
//   @Get('period')
//   async getSalaryRecordsByPeriodFilter(
//     @Query('month') month?: number,
//     @Query('year') year?: number,
//   ) {
//     try {
//       let records;
//       if (month && year) {
//         records = await this.salaryService.getSalaryRecordsByPeriod(month, year);
//       } else {
//         // Get recent records if no filter
//         const currentDate = new Date();
//         records = await this.salaryService.getSalaryRecordsByPeriod(
//           currentDate.getMonth() + 1,
//           currentDate.getFullYear()
//         );
//       }
//       return {
//         status: 'success',
//         data: records,
//       };
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Failed to fetch salary records',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   // GET /salary/download/:month/:year - Download salary sheet as CSV
//   @Get('download/:month/:year')
//   async downloadSalarySheet(
//     @Param('month') month: string,
//     @Param('year') year: string,
//     @Res() res: Response
//   ) {
//     try {
//       const monthNum = parseInt(month);
//       const yearNum = parseInt(year);

//       if (isNaN(monthNum) || isNaN(yearNum)) {
//         throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
//       }

//       if (monthNum < 1 || monthNum > 12) {
//         throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
//       }

//       const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
      
//       // Convert to CSV
//       const csv = this.convertToCSV(records);
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=salary-${monthNum}-${yearNum}.csv`);
//       res.send(csv);
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Failed to download salary sheet',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   private convertToCSV(records: any[]): string {
//     const headers = ['Name', 'EPF No', 'Position', 'Basic Salary', 'Overtime Pay', 'Allowance', 'Deductions', 'Leave Days', 'Net Salary', 'Generated Date'];
    
//     const csvData = records.map(record => [
//       record.user?.name || '',
//       record.user?.epfNo || '',
//       record.user?.jobPosition || '',
//       record.basicSalary,
//       record.overtimePay,
//       record.allowance || 0,
//       record.leaveDeductions,
//       record.totalLeave,
//       record.netSalary,
//       new Date(record.generatedAt).toLocaleDateString()
//     ]);

//     return [headers, ...csvData]
//       .map(row => row.map(field => `"${field}"`).join(','))
//       .join('\n');
//   }

//   // GET /salary/employee/:epfNo - Get employee by EPF No
//   @Get('employee/:epfNo')
//   async getEmployeeByEpfNo(@Param('epfNo') epfNo: string) {
//     try {
//       if (!epfNo) {
//         throw new HttpException('EPF No is required', HttpStatus.BAD_REQUEST);
//       }

//       // Use findUserByEmployeeId as fallback since getEmployeeByEpfNo doesn't exist
//       const employee = await this.salaryService.findUserByEmployeeId(epfNo);
      
//       if (!employee) {
//         throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
//       }

//       return {
//         status: 'success',
//         data: employee,
//       };
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.INTERNAL_SERVER_ERROR,
//           error: 'Failed to fetch employee',
//           message: error.message,
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Param, 
  Query,
  Res,
  Patch,
  Delete
} from '@nestjs/common';
import type { Response } from 'express';
import { 
  SalaryService, 
  EmployeeSalary,
  SalaryConfigDto,
  SalarySetupDto,
  EmployeeSalarySetup,
  ComprehensiveSalaryCalculation
} from './salary.service';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // ==================== COMPREHENSIVE SALARY SETUP ENDPOINTS ====================

  /**
   * GET /salary/employees/setup - Get all employees with comprehensive salary setup
   */
  @Get('employees/setup')
  async getEmployeesWithSalarySetup() {
    try {
      console.log('📋 [Controller] Fetching employees with comprehensive salary setup...');
      
      const employees = await this.salaryService.getAllEmployeesWithSalarySetup();
      
      return {
        status: 'success',
        message: 'Employees with comprehensive salary setup fetched successfully',
        data: employees,
        count: employees.length
      };
    } catch (error) {
      console.error('❌ [Controller] Error fetching employees with salary setup:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch employees with salary setup',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/setup/:employeeId - Get comprehensive salary setup for employee
   */
  @Get('setup/:employeeId')
  async getSalarySetup(@Param('employeeId') employeeId: string) {
    try {
      console.log('🔍 [Controller] Fetching comprehensive salary setup for:', employeeId);
      
      if (!employeeId) {
        throw new HttpException('Employee ID is required', HttpStatus.BAD_REQUEST);
      }

      const setup = await this.salaryService.getEmployeeSalarySetup(employeeId);
      
      if (!setup) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        message: 'Salary setup fetched successfully',
        data: setup,
      };
    } catch (error) {
      console.error('❌ [Controller] Error fetching salary setup:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch salary setup',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /salary/setup - Save comprehensive salary setup
   */
  @Post('setup')
  async saveSalarySetup(@Body() body: SalarySetupDto) {
    try {
      console.log('💾 [Controller] Saving comprehensive salary setup for user:', body.userId);
      
      if (!body.userId || body.basicSalary === undefined) {
        throw new HttpException(
          'userId and basicSalary are required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.basicSalary < 0) {
        throw new HttpException(
          'Basic salary cannot be negative',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate percentages
      if (body.epfPercentage && (body.epfPercentage < 0 || body.epfPercentage > 100)) {
        throw new HttpException(
          'EPF percentage must be between 0 and 100',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.etfPercentage && (body.etfPercentage < 0 || body.etfPercentage > 100)) {
        throw new HttpException(
          'ETF percentage must be between 0 and 100',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.taxPercentage && (body.taxPercentage < 0 || body.taxPercentage > 100)) {
        throw new HttpException(
          'Tax percentage must be between 0 and 100',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.salaryService.saveSalarySetup(body);
      
      return {
        status: 'success',
        message: 'Comprehensive salary setup saved successfully',
        data: result,
      };
    } catch (error) {
      console.error('❌ [Controller] Error saving salary setup:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to save salary setup',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PATCH /salary/setup/:employeeId - Update comprehensive salary setup
   */
  @Patch('setup/:employeeId')
  async updateSalarySetup(
    @Param('employeeId') employeeId: string,
    @Body() body: Partial<SalarySetupDto>
  ) {
    try {
      console.log('🔄 [Controller] Updating salary setup for employee:', employeeId);
      
      if (!employeeId) {
        throw new HttpException('Employee ID is required', HttpStatus.BAD_REQUEST);
      }

      // Get current setup to merge with updates
      const currentSetup = await this.salaryService.getEmployeeSalarySetup(employeeId);
      
      if (!currentSetup) {
        throw new HttpException('Employee salary setup not found', HttpStatus.NOT_FOUND);
      }

      // Create new setup with merged data (this creates a new version)
      const updatedSetup: SalarySetupDto = {
        userId: currentSetup.id,
        basicSalary: body.basicSalary ?? currentSetup.basicSalary,
        otRate: body.otRate ?? currentSetup.otRate,
        regulatoryAllowance: body.regulatoryAllowance ?? currentSetup.regulatoryAllowance,
        tasksAllowance1: body.tasksAllowance1 ?? currentSetup.tasksAllowance1,
        tasksAllowance2: body.tasksAllowance2 ?? currentSetup.tasksAllowance2,
        tasksAllowance3: body.tasksAllowance3 ?? currentSetup.tasksAllowance3,
        tasksAllowance4: body.tasksAllowance4 ?? currentSetup.tasksAllowance4,
        tasksAllowance5: body.tasksAllowance5 ?? currentSetup.tasksAllowance5,
        perDayRate: body.perDayRate ?? currentSetup.perDayRate,
        latePerDayRate: body.latePerDayRate ?? currentSetup.latePerDayRate,
        paymentMethod: body.paymentMethod ?? currentSetup.paymentMethod,
        paymentFrequency: body.paymentFrequency ?? currentSetup.paymentFrequency,
        salaryDaysCalculation: body.salaryDaysCalculation ?? currentSetup.salaryDaysCalculation,
        epfPercentage: body.epfPercentage ?? currentSetup.epfPercentage,
        etfPercentage: body.etfPercentage ?? currentSetup.etfPercentage,
        taxPercentage: body.taxPercentage ?? currentSetup.taxPercentage,
      };

      const result = await this.salaryService.saveSalarySetup(updatedSetup);
      
      return {
        status: 'success',
        message: 'Salary setup updated successfully',
        data: result,
      };
    } catch (error) {
      console.error('❌ [Controller] Error updating salary setup:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update salary setup',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/calculate-comprehensive/:userId/:month/:year - Calculate comprehensive salary
   */
  @Get('calculate-comprehensive/:userId/:month/:year')
  async calculateComprehensiveSalary(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    try {
      console.log(`🧮 [Controller] Calculating comprehensive salary for user ${userId}, ${month}/${year}`);
      
      const userIdNum = parseInt(userId);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (isNaN(userIdNum) || isNaN(monthNum) || isNaN(yearNum)) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const calculation = await this.salaryService.calculateComprehensiveSalary(userIdNum, monthNum, yearNum);
      
      return {
        status: 'success',
        message: 'Comprehensive salary calculation completed',
        data: calculation,
      };
    } catch (error) {
      console.error('❌ [Controller] Error calculating comprehensive salary:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to calculate comprehensive salary',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /salary/generate-comprehensive - Generate comprehensive salary record
   */
  @Post('generate-comprehensive')
  async generateComprehensiveSalaryRecord(
    @Body('userId') userId: number,
    @Body('month') month: number,
    @Body('year') year: number,
  ) {
    try {
      console.log(`📊 [Controller] Generating comprehensive salary record for user ${userId}, ${month}/${year}`);
      
      if (!userId || !month || !year) {
        throw new HttpException(
          'userId, month, and year are required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (month < 1 || month > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const result = await this.salaryService.generateComprehensiveSalaryRecord(userId, month, year);
      
      return {
        status: 'success',
        message: 'Comprehensive salary record generated successfully',
        data: result,
      };
    } catch (error) {
      console.error('❌ [Controller] Error generating comprehensive salary record:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to generate comprehensive salary record',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/components/:salaryRecordId - Get salary components for a record
   */
  @Get('components/:salaryRecordId')
  async getSalaryComponents(@Param('salaryRecordId') salaryRecordId: string) {
    try {
      console.log('🔍 [Controller] Fetching salary components for record:', salaryRecordId);
      
      const recordId = parseInt(salaryRecordId);
      if (isNaN(recordId)) {
        throw new HttpException('Invalid salary record ID', HttpStatus.BAD_REQUEST);
      }

      // This would require a new method in the service to fetch components
      // For now, we'll return a placeholder response
      return {
        status: 'success',
        message: 'Salary components fetched successfully',
        data: {
          salaryRecordId: recordId,
          components: [] // Would be populated by service method
        }
      };
    } catch (error) {
      console.error('❌ [Controller] Error fetching salary components:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch salary components',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== EXISTING ENDPOINTS (BACKWARD COMPATIBILITY) ====================

  /**
   * GET /salary/employees - Get all employees with basic salary configs
   */
  @Get('employees')
  async getEmployees(): Promise<EmployeeSalary[]> {
    try {
      console.log('📋 [Controller] Fetching employees with basic salary config...');
      
      const employees = await this.salaryService.getAllEmployees();
      
      return employees;
    } catch (error) {
      console.error('❌ [Controller] Error fetching employees:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch employees',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/test - Test endpoint
   */
  @Get('test')
  async test() {
    console.log('✅ [Controller] Test endpoint hit!');
    return { 
      message: 'Salary API is working!', 
      timestamp: new Date(),
      features: ['basic', 'comprehensive', 'calculation', 'generation']
    };
  }

  /**
   * POST /salary/config - Save basic salary configuration
   */
  @Post('config')
  async saveSalary(@Body() body: SalaryConfigDto) {
    try {
      if (!body.userId || body.basicSalary === undefined) {
        throw new HttpException(
          'userId and basicSalary are required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.basicSalary < 0) {
        throw new HttpException(
          'Basic salary cannot be negative',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.salaryService.saveSalaryConfig(body);
      
      return {
        status: 'success',
        message: 'Salary configuration saved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to save salary configuration',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/config/:userId - Get basic salary config for user
   */
  @Get('config/:userId')
  async getSalaryConfig(@Param('userId') userId: string) {
    try {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      }

      const config = await this.salaryService.getSalaryConfig(userIdNum);
      
      return {
        status: 'success',
        data: config,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch salary configuration',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/calculate/:userId/:month/:year - Calculate basic salary without saving
   */
  @Get('calculate/:userId/:month/:year')
  async calculateSalary(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    try {
      const userIdNum = parseInt(userId);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (isNaN(userIdNum) || isNaN(monthNum) || isNaN(yearNum)) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const calculation = await this.salaryService.getSalaryCalculation(userIdNum, monthNum, yearNum);
      
      return {
        status: 'success',
        data: calculation,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to calculate salary',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /salary/generate - Generate and save basic salary record
   */
  @Post('generate')
  async generateSalaryRecord(
    @Body('userId') userId: number,
    @Body('month') month: number,
    @Body('year') year: number,
  ) {
    try {
      if (!userId || !month || !year) {
        throw new HttpException(
          'userId, month, and year are required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (month < 1 || month > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const result = await this.salaryService.generateSalaryForEmployee(userId, month, year);
      
      return {
        status: 'success',
        message: 'Salary record generated successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to generate salary record',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/records/:userId - Get salary records for user
   */
  @Get('records/:userId')
  async getSalaryRecords(@Param('userId') userId: string) {
    try {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
      }

      const records = await this.salaryService.getSalaryRecords(userIdNum);
      
      return {
        status: 'success',
        data: records,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch salary records',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/period/:month/:year - Get salary records for period
   */
  @Get('period/:month/:year')
  async getSalaryRecordsByPeriod(
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    try {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (isNaN(monthNum) || isNaN(yearNum)) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
      
      return {
        status: 'success',
        data: records,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch salary records for period',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /salary/period - Get salary records with optional month/year filter
   */
  @Get('period')
  async getSalaryRecordsByPeriodFilter(
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    try {
      let records;
      if (month && year) {
        records = await this.salaryService.getSalaryRecordsByPeriod(month, year);
      } else {
        // Get recent records if no filter
        const currentDate = new Date();
        records = await this.salaryService.getSalaryRecordsByPeriod(
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );
      }
      
      return {
        status: 'success',
        data: records,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch salary records',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /salary/download/:month/:year - Download salary sheet as CSV
   */
  @Get('download/:month/:year')
  async downloadSalarySheet(
    @Param('month') month: string,
    @Param('year') year: string,
    @Res() res: Response
  ) {
    try {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (isNaN(monthNum) || isNaN(yearNum)) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new HttpException('Month must be between 1 and 12', HttpStatus.BAD_REQUEST);
      }

      const records = await this.salaryService.getSalaryRecordsByPeriod(monthNum, yearNum);
      
      // Convert to CSV
      const csv = this.convertToCSV(records);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=salary-${monthNum}-${yearNum}.csv`);
      res.send(csv);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to download salary sheet',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /salary/employee/:epfNo - Get employee by EPF No
   */
  @Get('employee/:epfNo')
  async getEmployeeByEpfNo(@Param('epfNo') epfNo: string) {
    try {
      if (!epfNo) {
        throw new HttpException('EPF No is required', HttpStatus.BAD_REQUEST);
      }

      const employee = await this.salaryService.findUserByEmployeeId(epfNo);
      
      if (!employee) {
        throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        data: employee,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch employee',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Convert records to CSV format
   */
  private convertToCSV(records: any[]): string {
    const headers = [
      'Name', 'EPF No', 'Position', 'Basic Salary', 
      'Overtime Pay', 'Allowance', 'Deductions', 
      'Leave Days', 'Net Salary', 'Generated Date'
    ];
    
    const csvData = records.map(record => [
      record.user?.name || '',
      record.user?.epfNo || '',
      record.user?.jobPosition || '',
      record.basicSalary,
      record.overtimePay,
      record.allowance || 0,
      record.leaveDeductions,
      record.totalLeave,
      record.netSalary,
      new Date(record.generatedAt).toLocaleDateString()
    ]);

    return [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  /**
   * Convert comprehensive records to CSV format
   */
  private convertComprehensiveToCSV(records: any[]): string {
    const headers = [
      'Name', 'EPF No', 'Position', 'Basic Salary', 'Total Allowances',
      'Overtime Pay', 'EPF Deduction', 'ETF Deduction', 'Tax Deduction',
      'Leave Deductions', 'Total Deductions', 'Gross Salary', 'Net Salary', 'Generated Date'
    ];
    
    const csvData = records.map(record => [
      record.user?.name || '',
      record.user?.epfNo || '',
      record.user?.jobPosition || '',
      record.basicSalary,
      record.totalAllowances || 0,
      record.overtimePay,
      record.epfDeduction || 0,
      record.etfDeduction || 0,
      record.taxDeduction || 0,
      record.leaveDeductions,
      record.totalDeductions || 0,
      record.grossSalary || 0,
      record.netSalary,
      new Date(record.generatedAt).toLocaleDateString()
    ]);

    return [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}