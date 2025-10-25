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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let EmployeesService = class EmployeesService {
    database;
    constructor(database) {
        this.database = database;
    }
    async updateEmployeeImage(userId, imagePath) {
        console.log('🔄 Starting database update...');
        console.log('User ID:', userId);
        console.log('Image path to save:', imagePath);
        try {
            const existingUser = await this.database.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, imagePath: true }
            });
            console.log('🔍 Existing user data:', existingUser);
            if (!existingUser) {
                console.log('❌ User not found with ID:', userId);
                throw new Error('User not found');
            }
            const updatedUser = await this.database.user.update({
                where: { id: userId },
                data: {
                    imagePath: imagePath
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imagePath: true,
                    jobPosition: true,
                    epfNo: true,
                }
            });
            console.log('✅ Database update successful:', updatedUser);
            const verifiedUser = await this.database.user.findUnique({
                where: { id: userId },
                select: { imagePath: true }
            });
            console.log('🔍 Verification - current imagePath:', verifiedUser?.imagePath);
            return updatedUser;
        }
        catch (error) {
            console.error('❌ Database update error:', error);
            console.error('Error details:', error.message);
            throw new Error(`Failed to update user image: ${error.message}`);
        }
    }
    async getEmployeeById(userId) {
        try {
            const user = await this.database.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    imagePath: true,
                    jobPosition: true,
                    epfNo: true,
                    createdAt: true,
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], EmployeesService);
//# sourceMappingURL=employee.service.js.map