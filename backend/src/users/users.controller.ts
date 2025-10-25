import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Express } from 'express';
import { File as MulterFile } from 'multer';
import { UsersService } from './users.service';
import { CreateRegUserDto, UpdateRegUserDto } from './dto/users.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { diskStorage } from 'multer';
import fs from 'fs';
import sharp from 'sharp';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    console.log('📋 [Backend] GET /users - Fetching all users');
    return this.usersService.listUsers();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('🔍 [Backend] GET /users/' + id + ' - Fetching user by ID');
    return this.usersService.findUserById(id);
  }

  @Post()
  create(@Body() dto: CreateRegUserDto) {
    console.log('➕ [Backend] POST /users - Creating new user');
    console.log('📝 [Backend] Create data:', dto);
    return this.usersService.upsertRegUser(dto);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const userId = req.params.id;
          const fileExtension = path.extname(file.originalname);
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
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegUserDto,
    @UploadedFile() file: MulterFile,
  ) {
    console.log('🔄 [Backend] PATCH /users/' + id);
    console.log('📝 [Backend] Update data:', dto);
    console.log('🖼️ [Backend] File uploaded:', file ? 'Yes' : 'No');

    try {
      const updateData = { ...dto };

      // ✅ Log the new fields specifically
      if (updateData.joinDate) {
        console.log('📅 [Backend] Join date received:', updateData.joinDate);
      }
      if (updateData.address) {
        console.log('🏠 [Backend] Address received:', updateData.address);
      }

      if (file) {
        console.log('🖼️ [Backend] Processing uploaded image');
        const uploadsDir = './uploads';

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const finalFilename = `${id}.webp`;
        const finalPath = path.join(uploadsDir, finalFilename);

        // Process image with sharp
        await sharp(file.path)
          .resize({ width: 200, height: 200, fit: 'cover' })
          .toFormat('webp')
          .toFile(finalPath);

        // Remove original uploaded file
        fs.unlinkSync(file.path);

        updateData.imagePath = `/uploads/${finalFilename}`;
        console.log('✅ [Backend] Image processed and saved:', updateData.imagePath);
      }

      const result = await this.usersService.updateRegUserById(id, updateData);
      console.log('✅ [Backend] User updated successfully');
      return result;
    } catch (error) {
      console.error('❌ [Backend] Error updating user:', error);
      console.error('❌ [Backend] Error stack:', error.stack);
      
      // ✅ Better error handling for validation errors
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(
          error.message || 'Validation failed',
          HttpStatus.BAD_REQUEST
        );
      }
      
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ Add a simple update endpoint without file upload for testing
  @Patch(':id/simple')
  async updateSimple(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegUserDto,
  ) {
    console.log('🔄 [Backend] PATCH /users/' + id + '/simple');
    console.log('📝 [Backend] Simple update data:', dto);

    try {
      const result = await this.usersService.updateRegUserById(id, dto);
      console.log('✅ [Backend] User updated successfully (simple)');
      return result;
    } catch (error) {
      console.error('❌ [Backend] Error in simple update:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Optional: Keep for backward compatibility
  @Get('employee/:employeeId')
  findByEmployeeId(@Param('employeeId') employeeId: string) {
    console.log('🔍 [Backend] GET /users/employee/' + employeeId);
    return this.usersService.findUserByEmployeeId(employeeId);
  }

  @Patch('employee/:employeeId')
  updateByEmployeeId(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateRegUserDto,
  ) {
    console.log('🔄 [Backend] PATCH /users/employee/' + employeeId);
    console.log('📝 [Backend] Update data:', dto);
    return this.usersService.updateRegUserFields(employeeId, dto);
  }

  // ✅ Add a test endpoint to verify the new fields work
  @Post(':id/test-fields')
  async testFields(
    @Param('id', ParseIntPipe) id: number,
    @Body() testData: { joinDate?: string; address?: string }
  ) {
    console.log('🧪 [Backend] Testing new fields for user:', id);
    console.log('📝 [Backend] Test data:', testData);

    try {
      const updateData: UpdateRegUserDto = {
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
    } catch (error) {
      console.error('❌ [Backend] Test update failed:', error);
      return {
        success: false,
        message: error.message,
        error: error.response
      };
    }
  }
}