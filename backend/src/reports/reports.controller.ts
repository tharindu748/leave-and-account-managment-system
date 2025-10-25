// src/reports/reports.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':id/dashboard')
  async getEmployeeDashboard(@Param('id') id: string) {
    return this.reportsService.getEmployeeDashboardData(parseInt(id));
  }
}