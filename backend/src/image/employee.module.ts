// src/image/employee.module.ts
import { Module } from '@nestjs/common';
import { EmployeesController } from './employee.controller'; // Change to EmployeesController
import { EmployeesService } from './employee.service'; // Change to EmployeesService
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, DatabaseService],
  exports: [EmployeesService],
})
export class EmployeesModule {}