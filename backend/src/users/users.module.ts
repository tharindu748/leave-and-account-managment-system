import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ReportsService } from '../reports/reports.service'; // Add this
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [DatabaseModule],
  // providers: [UsersService],
  providers: [UsersService, ReportsService, DatabaseService], // Add ReportsService here
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
