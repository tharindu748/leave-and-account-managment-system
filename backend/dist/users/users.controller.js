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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const users_service_1 = require("./users.service");
const users_dto_1 = require("./dto/users.dto");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = __importDefault(require("path"));
const multer_2 = require("multer");
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll() {
        console.log('📋 [Backend] GET /users - Fetching all users');
        return this.usersService.listUsers();
    }
    findOne(id) {
        console.log('🔍 [Backend] GET /users/' + id + ' - Fetching user by ID');
        return this.usersService.findUserById(id);
    }
    create(dto) {
        console.log('➕ [Backend] POST /users - Creating new user');
        console.log('📝 [Backend] Create data:', dto);
        return this.usersService.upsertRegUser(dto);
    }
    async update(id, dto, file) {
        console.log('🔄 [Backend] PATCH /users/' + id);
        console.log('📝 [Backend] Update data:', dto);
        console.log('🖼️ [Backend] File uploaded:', file ? 'Yes' : 'No');
        try {
            const updateData = { ...dto };
            if (updateData.joinDate) {
                console.log('📅 [Backend] Join date received:', updateData.joinDate);
            }
            if (updateData.address) {
                console.log('🏠 [Backend] Address received:', updateData.address);
            }
            if (file) {
                console.log('🖼️ [Backend] Processing uploaded image');
                const uploadsDir = './uploads';
                if (!fs_1.default.existsSync(uploadsDir)) {
                    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
                }
                const finalFilename = `${id}.webp`;
                const finalPath = path_1.default.join(uploadsDir, finalFilename);
                await (0, sharp_1.default)(file.path)
                    .resize({ width: 200, height: 200, fit: 'cover' })
                    .toFormat('webp')
                    .toFile(finalPath);
                fs_1.default.unlinkSync(file.path);
                updateData.imagePath = `/uploads/${finalFilename}`;
                console.log('✅ [Backend] Image processed and saved:', updateData.imagePath);
            }
            const result = await this.usersService.updateRegUserById(id, updateData);
            console.log('✅ [Backend] User updated successfully');
            return result;
        }
        catch (error) {
            console.error('❌ [Backend] Error updating user:', error);
            console.error('❌ [Backend] Error stack:', error.stack);
            if (error.status === common_1.HttpStatus.BAD_REQUEST) {
                throw new common_1.HttpException(error.message || 'Validation failed', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException(error.message || 'Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSimple(id, dto) {
        console.log('🔄 [Backend] PATCH /users/' + id + '/simple');
        console.log('📝 [Backend] Simple update data:', dto);
        try {
            const result = await this.usersService.updateRegUserById(id, dto);
            console.log('✅ [Backend] User updated successfully (simple)');
            return result;
        }
        catch (error) {
            console.error('❌ [Backend] Error in simple update:', error);
            throw new common_1.HttpException(error.message || 'Internal server error', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findByEmployeeId(employeeId) {
        console.log('🔍 [Backend] GET /users/employee/' + employeeId);
        return this.usersService.findUserByEmployeeId(employeeId);
    }
    updateByEmployeeId(employeeId, dto) {
        console.log('🔄 [Backend] PATCH /users/employee/' + employeeId);
        console.log('📝 [Backend] Update data:', dto);
        return this.usersService.updateRegUserFields(employeeId, dto);
    }
    async testFields(id, testData) {
        console.log('🧪 [Backend] Testing new fields for user:', id);
        console.log('📝 [Backend] Test data:', testData);
        try {
            const updateData = {
                joinDate: testData.joinDate,
                address: testData.address,
            };
            const result = await this.usersService.updateRegUserById(id, updateData);
            console.log('✅ [Backend] Test update successful');
            return {
                success: true,
                message: 'Fields updated successfully',
                data: result
            };
        }
        catch (error) {
            console.error('❌ [Backend] Test update failed:', error);
            return {
                success: false,
                message: error.message,
                error: error.response
            };
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateRegUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_2.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const userId = req.params.id;
                const fileExtension = path_1.default.extname(file.originalname);
                const newFilename = `${userId}${fileExtension}`;
                callback(null, newFilename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.startsWith('image/')) {
                return callback(new Error('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, users_dto_1.UpdateRegUserDto, typeof (_a = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/simple'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, users_dto_1.UpdateRegUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateSimple", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findByEmployeeId", null);
__decorate([
    (0, common_1.Patch)('employee/:employeeId'),
    __param(0, (0, common_1.Param)('employeeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.UpdateRegUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateByEmployeeId", null);
__decorate([
    (0, common_1.Post)(':id/test-fields'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "testFields", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map