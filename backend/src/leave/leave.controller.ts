import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  HttpException,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create_leave_request.dto';
import { LeaveType } from '@prisma/client';
import { ApproveLeaveRequestDto } from './dto/approve_leave_request.dto';
import { CancelLeaveRequestDto } from './dto/cancel_leave_request.dto';
import { UpdateLeavePolicyDto } from './dto/update_leave_policy.dto';

@Controller('leave')
export class LeaveController {
  constructor(private leaveService: LeaveService) {}

  @Post('request')
  async createLeaveRequest(@Body() data: CreateLeaveRequestDto) {
    return this.leaveService.createLeaveRequest(data);
  }

  @Get('requests')
  async getLeaveRequests(@Query('userId') userId?: string) {
    let parsedId: number | undefined;

    if (userId !== undefined) {
      if (userId === '')
        throw new BadRequestException('userId cannot be empty');
      const n = Number(userId);
      if (!Number.isInteger(n)) {
        throw new BadRequestException('userId must be an integer');
      }
      parsedId = n;
    }

    return this.leaveService.findLeaveRequests(parsedId);
  }

  // Calendar endpoint
  @Get('calendar')
  async getCalendarData(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const currentDate = new Date();
    const yearNum = year ? parseInt(year) : currentDate.getFullYear();
    const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1;
    
    if (isNaN(yearNum) || isNaN(monthNum)) {
      throw new BadRequestException('Invalid year or month parameters');
    }

    if (monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    return this.leaveService.getCalendarData(yearNum, monthNum);
  }

  @Get('balance/:userId/:year/:leaveType')
  async getLeaveBalance(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('year', ParseIntPipe) year: number,
    @Param('leaveType') leaveType: LeaveType,
  ) {
    return this.leaveService.getLeaveBalance(userId, year, leaveType);
  }

  @Post('approve')
  @HttpCode(HttpStatus.OK)
  async approveLeaveRequest(@Body() data: ApproveLeaveRequestDto) {
    return this.leaveService.approveLeaveRequest(data);
  }

  @Post('rejected')
  @HttpCode(HttpStatus.OK)
  async cancelLeaveRequest(@Body() data: CancelLeaveRequestDto) {
    return this.leaveService.cancelLeaveRequest(data);
  }

  @Get('policy')
  async getLeavePolicy() {
    return this.leaveService.findLeavePolicy();
  }

  @Patch('policy')
  async updateLeavePolicy(@Body() data: UpdateLeavePolicyDto) {
    return this.leaveService.updateLeavePolicy(
      data.leaveType,
      data.defaultBalance,
    );
  }

  // Test endpoint
  @Get('test')
  async testEndpoint() {
    return this.leaveService.testEndpoint();
  }

@Get('balance/user/:userId')
async getUserLeaveBalances(@Param('userId', ParseIntPipe) userId: number) {
  const currentYear = new Date().getFullYear();
  
  try {
    console.log(`📊 Fetching leave balances for user ${userId}, year ${currentYear}`);
    
    // Get current leave policies
    const policies = await this.leaveService.findLeavePolicy();
    const annualPolicy = policies.find(p => p.leaveType === 'ANNUAL');
    const casualPolicy = policies.find(p => p.leaveType === 'CASUAL');

    console.log('📋 Leave policies:', { annualPolicy, casualPolicy });

    // Get approved leave requests for current year to calculate taken leaves
    const approvedLeaves = await this.leaveService.findLeaveRequests(userId);
    const currentYearApprovedLeaves = approvedLeaves.filter(leave => 
      leave.status === 'APPROVED' && 
      leave.dates.some(date => new Date(date.leaveDate).getFullYear() === currentYear)
    );

    // Calculate leave counts from approved requests (same as dashboard logic)
    let sickLeave = 0;
    let annualLeave = 0;

    currentYearApprovedLeaves.forEach(request => {
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

    // Calculate remaining holidays based on leave balances (same as dashboard logic)
    const annualBalance = await this.leaveService.getLeaveBalance(userId, currentYear, LeaveType.ANNUAL);
    const casualBalance = await this.leaveService.getLeaveBalance(userId, currentYear, LeaveType.CASUAL);
    
    // If no balances exist, use default policies
    const defaultAnnual = annualPolicy?.defaultBalance || 21;
    const defaultCasual = casualPolicy?.defaultBalance || 7;

    const remainingAnnual = annualBalance.balance > 0 ? annualBalance.balance : defaultAnnual - annualLeave;
    const remainingCasual = casualBalance.balance > 0 ? casualBalance.balance : defaultCasual - sickLeave;
    
    const remainingHolidays = Math.max(0, remainingAnnual + remainingCasual);

    // ✅ RETURN DATA IN SAME FORMAT AS DASHBOARD
    const result = {
      annualLeave: {
        total: annualPolicy?.defaultBalance || 21,
        available: remainingAnnual // This should match dashboard's remainingHolidays calculation
      },
      casualSickLeave: {
        total: casualPolicy?.defaultBalance || 7,
        available: remainingCasual // This should match dashboard's remainingHolidays calculation
      },
      // ✅ ADD DEBUG INFO TO SEE WHAT'S HAPPENING
      debug: {
        annualTaken: annualLeave,
        casualTaken: sickLeave,
        annualBalance: annualBalance.balance,
        casualBalance: casualBalance.balance,
        remainingHolidays: remainingHolidays
      }
    };

    console.log('✅ Calendar leave data (matching dashboard):', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching leave balances:', error);
    throw new HttpException(
      'Failed to fetch leave balances',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
}