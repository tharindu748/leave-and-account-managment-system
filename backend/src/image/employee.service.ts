// src/image/employee.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EmployeesService {
  constructor(private database: DatabaseService) {}

  async updateEmployeeImage(userId: number, imagePath: string) {
    console.log('🔄 Starting database update...');
    console.log('User ID:', userId);
    console.log('Image path to save:', imagePath);

    try {
      // First, check if user exists
      const existingUser = await this.database.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, imagePath: true }
      });

      console.log('🔍 Existing user data:', existingUser);

      if (!existingUser) {
        console.log('❌ User not found with ID:', userId);
        throw new Error('User not found');
      }

      // Update the user
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
      
      // Verify the update by fetching again
      const verifiedUser = await this.database.user.findUnique({
        where: { id: userId },
        select: { imagePath: true }
      });
      
      console.log('🔍 Verification - current imagePath:', verifiedUser?.imagePath);
      
      return updatedUser;
    } catch (error) {
      console.error('❌ Database update error:', error);
      console.error('Error details:', error.message);
      throw new Error(`Failed to update user image: ${error.message}`);
    }
  }

  // ADD THIS MISSING METHOD
  async getEmployeeById(userId: number) {
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
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }
}