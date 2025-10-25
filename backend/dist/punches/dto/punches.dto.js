"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePunchDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePunchDto {
    employeeId;
    eventTime;
    direction;
    source;
    note;
    createdBy;
}
exports.CreatePunchDto = CreatePunchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)({}, { message: 'eventTime must be a valid ISO date string' }),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "eventTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['IN', 'OUT']),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['device', 'manual']),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePunchDto.prototype, "createdBy", void 0);
//# sourceMappingURL=punches.dto.js.map