import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HttpAuthGuard, SetRole } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { ApiResponse } from 'src/core/types/api-response';
import { CreateCategoryBodyDTO } from './dto/create-category.dto';
import { UpdateCategoryBodyDTO, UpdateCategoryParamsDTO } from './dto/update-category';
import { Types } from 'mongoose';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';

@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@SetRole(UserRoles.ADMIN)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  /**
   * GET ALL CATEGORIES
   */
  @Get()
  async getAll() {
    const result = await this.categoryService.findAll();

    return ApiResponse.success({ data: result });
  }

  /**
   * CREATE CATEGORY
   */
  @Post()
  async create(
    @Body() body: CreateCategoryBodyDTO,
  ) {
    const { name } = body;

    const data = await this.categoryService.createCategory({ name });

    return ApiResponse.success({ data });
  }

  /**
   * UPDATE CATEGORY
   */
  @Patch(':id')
  async update(
    @Param() params: UpdateCategoryParamsDTO,
    @Body() body: UpdateCategoryBodyDTO,
  ) {
    const { name } = body;
    const id = new Types.ObjectId(params.id);

    const data = await this.categoryService.updateCategory(id, { name });

    return ApiResponse.success({ data });
  }

  /**
   * DELETE CATEGORY
   */
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    const id = new Types.ObjectId(params.id);

    await this.categoryService.deleteCategory(id);

    return ApiResponse.success({message: 'Category deleted successfully'});
  }

}