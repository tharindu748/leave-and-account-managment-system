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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UsersService = class UsersService {
    db;
    constructor(db) {
        this.db = db;
    }
    async listUsers() {
        console.log('📋 [Service] Listing all users');
        try {
            const users = await this.db.user.findMany({
                where: { active: true },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                    createdAt: true,
                },
                orderBy: { name: 'asc' },
            });
            console.log(`✅ [Service] Found ${users.length} users`);
            return users;
        }
        catch (error) {
            console.error('❌ [Service] Error listing users:', error);
            throw error;
        }
    }
    async findUserById(id) {
        console.log('🔧 [Service] Finding user by ID:', id);
        try {
            const user = await this.db.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                    createdAt: true,
                    updatedAt: true,
                    isAdmin: true,
                    refreshToken: true,
                }
            });
            if (!user) {
                console.warn('⚠️ [Service] User not found with ID:', id);
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            console.log('✅ [Service] User found by ID:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error finding user by ID:', error);
            throw error;
        }
    }
    async findUserByEmail(email) {
        console.log('🔧 [Service] Finding user by email:', email);
        try {
            const user = await this.db.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                    isAdmin: true,
                    refreshToken: true,
                }
            });
            if (!user) {
                console.warn('⚠️ [Service] User not found with email:', email);
                return null;
            }
            console.log('✅ [Service] User found by email:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error finding user by email:', error);
            throw error;
        }
    }
    async create(createUserDto) {
        console.log('🔧 [Service] Creating new user');
        console.log('📝 [Service] Create data:', createUserDto);
        try {
            const user = await this.db.user.create({
                data: createUserDto,
            });
            console.log('✅ [Service] User created successfully:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error creating user:', error);
            if (error.code === 'P2002') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
    async update(id, updateData) {
        console.log('🔧 [Service] Updating user:', id);
        console.log('📝 [Service] Update data:', updateData);
        try {
            const user = await this.db.user.update({
                where: { id },
                data: updateData,
            });
            console.log('✅ [Service] User updated successfully:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error updating user:', error);
            if (error.code === 'P2025') {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw error;
        }
    }
    async updateRegUserById(id, updateData) {
        console.log('🔧 [Service] Updating user by ID:', id);
        console.log('🔧 [Service] Update data:', updateData);
        try {
            const user = await this.db.user.findUnique({
                where: { id },
            });
            if (!user) {
                console.warn('⚠️ [Service] User not found with ID:', id);
                throw new common_1.HttpException(`User with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            console.log('🔧 [Service] Found user:', { id: user.id, name: user.name });
            const cleanedData = this.cleanUpdateData(updateData);
            const updatedUser = await this.db.user.update({
                where: { id },
                data: cleanedData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            console.log('✅ [Service] User updated successfully:', {
                id: updatedUser.id,
                name: updatedUser.name
            });
            return updatedUser;
        }
        catch (error) {
            console.error('❌ [Service] Error updating user by ID:', error);
            if (error.code === 'P2025') {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error.code === 'P2002') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
    cleanUpdateData(updateData) {
        const cleaned = { ...updateData };
        const optionalFields = [
            'email', 'epfNo', 'nic', 'jobPosition',
            'imagePath', 'cardNumber', 'address'
        ];
        optionalFields.forEach(field => {
            if (cleaned[field] === '') {
                cleaned[field] = null;
            }
        });
        if (cleaned.joinDate !== undefined && cleaned.joinDate !== null && cleaned.joinDate !== '') {
            cleaned.joinDate = new Date(cleaned.joinDate);
        }
        else if (cleaned.joinDate === '') {
            cleaned.joinDate = null;
        }
        if (cleaned.validFrom !== undefined && cleaned.validFrom !== null && cleaned.validFrom !== '') {
            cleaned.validFrom = new Date(cleaned.validFrom);
        }
        else if (cleaned.validFrom === '') {
            cleaned.validFrom = null;
        }
        if (cleaned.validTo !== undefined && cleaned.validTo !== null && cleaned.validTo !== '') {
            cleaned.validTo = new Date(cleaned.validTo);
        }
        else if (cleaned.validTo === '') {
            cleaned.validTo = null;
        }
        console.log('🧹 [Service] Cleaned update data:', cleaned);
        return cleaned;
    }
    async upsertRegUser(dto) {
        console.log('🔧 [Service] Upserting user with employeeId:', dto.employeeId);
        try {
            const userData = {
                employeeId: dto.employeeId,
                name: dto.name,
                email: dto.employeeId + '@company.com',
                password: dto.password || 'defaultPassword',
                cardNumber: dto.cardNumber,
                validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
                validTo: dto.validTo ? new Date(dto.validTo) : null,
                epfNo: dto.epfNo,
                nic: dto.nic,
                jobPosition: dto.jobPosition,
                joinDate: dto.joinDate ? new Date(dto.joinDate) : null,
                address: dto.address || null,
            };
            const user = await this.db.user.upsert({
                where: { employeeId: dto.employeeId },
                update: userData,
                create: userData,
            });
            console.log('✅ [Service] User upserted successfully:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error upserting user:', error);
            throw error;
        }
    }
    async findUserByEmployeeId(employeeId) {
        console.log('🔧 [Service] Finding user by employeeId:', employeeId);
        try {
            const user = await this.db.user.findUnique({
                where: { employeeId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                }
            });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error finding user by employeeId:', error);
            throw error;
        }
    }
    async updateRegUserFields(employeeId, updateData) {
        console.log('🔧 [Service] Updating user by employeeId:', employeeId);
        try {
            const cleanedData = this.cleanUpdateData(updateData);
            const user = await this.db.user.update({
                where: { employeeId },
                data: cleanedData,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    employeeId: true,
                    epfNo: true,
                    nic: true,
                    jobPosition: true,
                    imagePath: true,
                    joinDate: true,
                    address: true,
                    active: true,
                }
            });
            console.log('✅ [Service] User updated by employeeId:', { id: user.id, name: user.name });
            return user;
        }
        catch (error) {
            console.error('❌ [Service] Error updating user by employeeId:', error);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map