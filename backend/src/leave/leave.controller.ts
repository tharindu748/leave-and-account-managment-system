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

    // Get current balances
    const annualBalance = await this.leaveService.getLeaveBalance(
      userId, currentYear, LeaveType.ANNUAL
    );
    const casualBalance = await this.leaveService.getLeaveBalance(
      userId, currentYear, LeaveType.CASUAL
    );

    console.log('💰 Raw balances from DB:', { 
      annual: annualBalance.balance, 
      casual: casualBalance.balance 
    });

    // ✅ CORRECT CALCULATION: Available = Total - Used
    const annualTotal = annualPolicy?.defaultBalance || 21;
    const casualTotal = casualPolicy?.defaultBalance || 7;

    // Calculate used leaves by counting approved leave requests
    const approvedLeaves = await this.leaveService.findLeaveRequests(userId);
    const currentYearApprovedLeaves = approvedLeaves.filter(leave => 
      leave.status === 'APPROVED' && 
      leave.dates.some(date => new Date(date.leaveDate).getFullYear() === currentYear)
    );

    let annualUsed = 0;
    let casualUsed = 0;

    currentYearApprovedLeaves.forEach(leave => {
      const daysCount = leave.dates.reduce((sum, date) => 
        sum + (date.isHalfDay ? 0.5 : 1), 0
      );
      if (leave.leaveType === 'ANNUAL') {
        annualUsed += daysCount;
      } else if (leave.leaveType === 'CASUAL') {
        casualUsed += daysCount;
      }
    });

    console.log('📅 Used leaves:', { annualUsed, casualUsed });

    // ✅ CORRECT: Available = Total - Used
    const result = {
      annualLeave: {
        total: annualTotal,
        available: Math.max(0, annualTotal - annualUsed) // ✅ CORRECT
      },
      casualSickLeave: {
        total: casualTotal,
        available: Math.max(0, casualTotal - casualUsed) // ✅ CORRECT
      }
    };

    console.log('✅ Corrected leave data:', result);
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