// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';
// import { DatabaseModule } from './database/database.module';
// import { AuthModule } from './auth/auth.module';
// import { LeaveModule } from './leave/leave.module';
// import { PunchesModule } from './punches/punches.module';
// import { AttendanceModule } from './attendance/attendance.module';
// import { SyncHistoryModule } from './sync-history/sync-history.module';
// import { AnalyticModule } from './analytic/analytic.module';
// import { SalaryModule } from './salary/salary.module';
// import { ReportsModule } from './report/reports.module';
// import { EmployeeController } from './image/employee.controller';
// import { EmployeeService } from './image/employee.service';
// import { DatabaseService } from './database/database.service';
// import { ReportsModules } from './reports/reports.module';

// @Module({
//   imports: [
//     UsersModule,
//     DatabaseModule,
//     AuthModule,
//     LeaveModule,
//     PunchesModule,
//     AttendanceModule,
//     SyncHistoryModule,
//     AnalyticModule,
//     SalaryModule,
//     ReportsModule,
//     ReportsModules

//   ],
//   controllers: [
//     AppController,
//     EmployeeController, // ✅ move here
//   ],
//   providers: [
//     AppService,
//     EmployeeService,   // ✅ move here
//     DatabaseService,   // ✅ move here
//   ],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { LeaveModule } from './leave/leave.module';
import { PunchesModule } from './punches/punches.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SyncHistoryModule } from './sync-history/sync-history.module';
import { AnalyticModule } from './analytic/analytic.module';
import { SalaryModule } from './salary/salary.module';
import { ReportsModule } from './reports/reports.module';
import { EmployeesController } from './image/employee.controller'; // Imported as EmployeesController
import { EmployeesService } from './image/employee.service'; // Imported as EmployeesService
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    LeaveModule,
    PunchesModule,
    AttendanceModule,
    SyncHistoryModule,
    AnalyticModule,
    SalaryModule,
    ReportsModule,
  ],
  controllers: [
    AppController,
    EmployeesController, // Use EmployeesController (plural) to match import
  ],
  providers: [
    AppService,
    EmployeesService, // Use EmployeesService (plural) to match import
    DatabaseService,
  ],
})
export class AppModule {}