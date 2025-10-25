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
exports.UpdateAttendanceConfigDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateAttendanceConfigDto {
    workStart;
    workEnd;
    otEnd;
    earlyStart;
}
exports.UpdateAttendanceConfigDto = UpdateAttendanceConfigDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'workStart must be HH:mm format' }),
    __metadata("design:type", String)
], UpdateAttendanceConfigDto.prototype, "workStart", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'workEnd must be HH:mm format' }),
    __metadata("design:type", String)
], UpdateAttendanceConfigDto.prototype, "workEnd", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'otEnd must be HH:mm format' }),
    __metadata("design:type", String)
], UpdateAttendanceConfigDto.prototype, "otEnd", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/, { message: 'earlyStart must be HH:mm format' }),
    __metadata("design:type", String)
], UpdateAttendanceConfigDto.prototype, "earlyStart", void 0);
//# sourceMappingURL=update-attendance-config.dto.js.map