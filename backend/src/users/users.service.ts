import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRegUserDto, UpdateRegUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

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
    } catch (error) {
      console.error('❌ [Service] Error listing users:', error);
      throw error;
    }
  }

  async findUserById(id: number) {
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
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      console.log('✅ [Service] User found by ID:', { id: user.id, name: user.name });
      return user;
    } catch (error) {
      console.error('❌ [Service] Error finding user by ID:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string) {
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
    } catch (error) {
      console.error('❌ [Service] Error finding user by email:', error);
      throw error;
    }
  }

  async create(createUserDto: any) {
    console.log('🔧 [Service] Creating new user');
    console.log('📝 [Service] Create data:', createUserDto);
    try {
      const user = await this.db.user.create({
        data: createUserDto,
      });
      console.log('✅ [Service] User created successfully:', { id: user.id, name: user.name });
      return user;
    } catch (error) {
      console.error('❌ [Service] Error creating user:', error);
      
      if (error.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      
      throw error;
    }
  }

  async update(id: number, updateData: any) {
    console.log('🔧 [Service] Updating user:', id);
    console.log('📝 [Service] Update data:', updateData);
    try {
      const user = await this.db.user.update({
        where: { id },
        data: updateData,
      });
      console.log('✅ [Service] User updated successfully:', { id: user.id, name: user.name });
      return user;
    } catch (error) {
      console.error('❌ [Service] Error updating user:', error);
      
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      throw error;
    }
  }

  // ✅ FIXED: Proper deleteUserById method
  async deleteUserById(id: number) {
    console.log('🗑️ [Service] Deleting user with ID:', id);
    try {
      // First check if user exists
      const user = await this.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.warn('⚠️ [Service] User not found with ID:', id);
        throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      // Delete the user
      const result = await this.db.user.delete({
        where: { id }
      });

      console.log('✅ [Service] User deleted successfully:', { id: result.id, name: result.name });
      return {
        success: true,
        message: `User "${result.name}" deleted successfully`,
        data: result
      };
    } catch (error) {
      console.error('❌ [Service] Error deleting user:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      throw new HttpException(
        error.message || 'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateRegUserById(id: number, updateData: UpdateRegUserDto) {
    console.log('🔧 [Service] Updating user by ID:', id);
    console.log('🔧 [Service] Update data:', updateData);

    try {
      // Check if user exists
      const user = await this.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.warn('⚠️ [Service] User not found with ID:', id);
        throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      console.log('🔧 [Service] Found user:', { id: user.id, name: user.name });

      // Clean up empty strings to null and handle dates
      const cleanedData = this.cleanUpdateData(updateData);

      // Update user
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
    } catch (error) {
      console.error('❌ [Service] Error updating user by ID:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (error.code === 'P2002') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      
      throw error;
    }
  }

  private cleanUpdateData(updateData: UpdateRegUserDto): any {
    const cleaned: any = { ...updateData };
    
    // Convert empty strings to null for optional fields
    const optionalFields = [
      'email', 'epfNo', 'nic', 'jobPosition', 
      'imagePath', 'cardNumber', 'address', 'employeeId'
    ];
    
    optionalFields.forEach(field => {
      if (cleaned[field] === '') {
        cleaned[field] = null;
      }
    });

    // Handle date fields
    if (cleaned.joinDate !== undefined && cleaned.joinDate !== null && cleaned.joinDate !== '') {
      cleaned.joinDate = new Date(cleaned.joinDate);
    } else if (cleaned.joinDate === '') {
      cleaned.joinDate = null;
    }

    if (cleaned.validFrom !== undefined && cleaned.validFrom !== null && cleaned.validFrom !== '') {
      cleaned.validFrom = new Date(cleaned.validFrom);
    } else if (cleaned.validFrom === '') {
      cleaned.validFrom = null;
    }

    if (cleaned.validTo !== undefined && cleaned.validTo !== null && cleaned.validTo !== '') {
      cleaned.validTo = new Date(cleaned.validTo);
    } else if (cleaned.validTo === '') {
      cleaned.validTo = null;
    }

    console.log('🧹 [Service] Cleaned update data:', cleaned);
    return cleaned;
  }

  async upsertRegUser(dto: CreateRegUserDto) {
    console.log('🔧 [Service] Upserting user with employeeId:', dto.employeeId);
    try {
      // Create a complete user data object with required fields
      const userData: any = {
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
    } catch (error) {
      console.error('❌ [Service] Error upserting user:', error);
      throw error;
    }
  }

  async findUserByEmployeeId(employeeId: string) {
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
    } catch (error) {
      console.error('❌ [Service] Error finding user by employeeId:', error);
      throw error;
    }
  }

  async updateRegUserFields(employeeId: string, updateData: UpdateRegUserDto) {
    console.log('🔧 [Service] Updating user by employeeId:', employeeId);
    try {
      // Clean up the data first
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
    } catch (error) {
      console.error('❌ [Service] Error updating user by employeeId:', error);
      throw error;
    }
  }
}