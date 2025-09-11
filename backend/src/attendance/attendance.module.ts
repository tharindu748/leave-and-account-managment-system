import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [AttendanceService, DatabaseService],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
