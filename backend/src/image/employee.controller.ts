import { Controller, Put, Param, Body, Get, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EmployeesService } from './employee.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Put(':id/update-image')
  async updateEmployeeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: { imagePath: string }
  ) {
    console.log('📝 Received update request:');
    console.log(' - User ID:', id);
    console.log(' - Image Path:', updateData.imagePath);

    if (!updateData.imagePath) {
      throw new HttpException('Image path is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.employeesService.updateEmployeeImage(id, updateData.imagePath);
      console.log('✅ Controller returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Controller error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getEmployeeById(id);
  }
}