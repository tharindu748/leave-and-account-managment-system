"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const leave_module_1 = require("./leave/leave.module");
const punches_module_1 = require("./punches/punches.module");
const attendance_module_1 = require("./attendance/attendance.module");
const sync_history_module_1 = require("./sync-history/sync-history.module");
const analytic_module_1 = require("./analytic/analytic.module");
const salary_module_1 = require("./salary/salary.module");
const reports_module_1 = require("./reports/reports.module");
const employee_controller_1 = require("./image/employee.controller");
const employee_service_1 = require("./image/employee.service");
const database_service_1 = require("./database/database.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            leave_module_1.LeaveModule,
            punches_module_1.PunchesModule,
            attendance_module_1.AttendanceModule,
            sync_history_module_1.SyncHistoryModule,
            analytic_module_1.AnalyticModule,
            salary_module_1.SalaryModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [
            app_controller_1.AppController,
            employee_controller_1.EmployeesController,
        ],
        providers: [
            app_service_1.AppService,
            employee_service_1.EmployeesService,
            database_service_1.DatabaseService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map