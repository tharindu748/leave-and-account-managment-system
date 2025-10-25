"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PunchesModule = void 0;
const common_1 = require("@nestjs/common");
const punches_service_1 = require("./punches.service");
const punches_controller_1 = require("./punches.controller");
const database_service_1 = require("../database/database.service");
let PunchesModule = class PunchesModule {
};
exports.PunchesModule = PunchesModule;
exports.PunchesModule = PunchesModule = __decorate([
    (0, common_1.Module)({
        providers: [punches_service_1.PunchesService, database_service_1.DatabaseService],
        controllers: [punches_controller_1.PunchesController],
        exports: [punches_service_1.PunchesService],
    })
], PunchesModule);
//# sourceMappingURL=punches.module.js.map