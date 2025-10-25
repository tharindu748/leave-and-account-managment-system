// import { Controller, Get, Post, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
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

// @Get('test')
// async test() {
//   console.log('✅ Test endpoint hit!');
//   return { message: 'API is working!', timestamp: new Date() };
// }

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
  Res 
} from '@nestjs/common';
import type { Response } from 'express'; // ✅ Use import type
import { SalaryService, EmployeeSalary } from './salary.service';
import type { SalaryConfigDto } from './salary.service';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  // GET /salary/employees - Get all employees with salary configs
  @Get('employees')
  async getEmployees(): Promise<EmployeeSalary[]> {
    try {
      return await this.salaryService.getAllEmployees();
    } catch (error) {
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

  @Get('test')
  async test() {
    console.log('✅ Test endpoint hit!');
    return { message: 'API is working!', timestamp: new Date() };
  }

  // POST /salary/config - Save salary configuration
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

  // GET /salary/config/:userId - Get salary config for user
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

  // GET /salary/calculate/:userId/:month/:year - Calculate salary without saving
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

  // POST /salary/generate - Generate and save salary record
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

  // GET /salary/records/:userId - Get salary records for user
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

  // GET /salary/period/:month/:year - Get salary records for period
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

  // GET /salary/period - Get salary records with optional month/year filter
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

  // GET /salary/download/:month/:year - Download salary sheet as CSV
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

  private convertToCSV(records: any[]): string {
    const headers = ['Name', 'EPF No', 'Position', 'Basic Salary', 'Overtime Pay', 'Allowance', 'Deductions', 'Leave Days', 'Net Salary', 'Generated Date'];
    
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

  // GET /salary/employee/:epfNo - Get employee by EPF No
  @Get('employee/:epfNo')
  async getEmployeeByEpfNo(@Param('epfNo') epfNo: string) {
    try {
      if (!epfNo) {
        throw new HttpException('EPF No is required', HttpStatus.BAD_REQUEST);
      }

      // Use findUserByEmployeeId as fallback since getEmployeeByEpfNo doesn't exist
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
}