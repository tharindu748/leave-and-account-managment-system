import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 🔹 Get most late employees
  @Get('most-late-employees')
  async getMostLateEmployees() {
    return this.reportsService.getMostLateEmployees();
  }

  // 🔹 Get least late employees
  @Get('least-late-employees')
  async getLeastLateEmployees() {
    return this.reportsService.getLeastLateEmployees();
  }

  // 🔹 Get summary for dashboard cards
  @Get('summary')
  async getSummary(@Query('date') date: string) {
    return this.reportsService.getSummary(new Date(date));
  }
}
