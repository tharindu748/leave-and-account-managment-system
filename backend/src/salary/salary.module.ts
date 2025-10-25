import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { DatabaseModule } from '../database/database.module'; // Import your existing DatabaseModule

@Module({
  imports: [DatabaseModule],  // Import DatabaseModule so SalaryService can use Prisma
  providers: [SalaryService], // Provide SalaryService
  controllers: [SalaryController], // Register SalaryController
  exports: [SalaryService], // Optional: export if other modules need SalaryService
})
export class SalaryModule {}
