import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HttpAuthGuard, Role } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { ApiResult } from 'src/core/types/api-response';
import { CreateSubCategoryBodyDTO } from './dto/create-category.dto';
import { UpdateSubCategoryBodyDTO, UpdateSubCategoryParamsDTO } from './dto/update-category';
import { Types } from 'mongoose';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';
import { SubCategoryService } from './sub-category.service';
import { ListSubCategoryQueryDTO } from './dto/get-category.dto';

@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Role(UserRoles.ADMIN)
@Controller('sub-category')
export class SubCategoryController {
    constructor(private readonly categoryService: SubCategoryService) { }

    /**
     * GET ALL SUB-CATEGORIES
     */
    @Role(UserRoles.USER)
    @Get()
    async getAll(
        @Query() query: ListSubCategoryQueryDTO,
    ) {
        const categoryId = query.categoryId
            ? new Types.ObjectId(query.categoryId)
            : undefined;

        const result = await this.categoryService.findAll(categoryId);

        return ApiResult.success({ data: result });
    }

    /**
     * CREATE SUB-CATEGORY
     */
    @Post()
    async create(
        @Body() body: CreateSubCategoryBodyDTO,
    ) {
        const { name } = body;
        const categoryId = new Types.ObjectId(body.categoryId);

        const data = await this.categoryService.createCategory({ name, categoryId });

        return ApiResult.success({ data });
    }

    /**
     * UPDATE SUB-CATEGORY
     */
    @Patch(':id')
    async update(
        @Param() params: UpdateSubCategoryParamsDTO,
        @Body() body: UpdateSubCategoryBodyDTO,
    ) {
        const { name } = body;
        const id = new Types.ObjectId(params.id);

        const data = await this.categoryService.updateCategory(id, { name });

        return ApiResult.success({ data });
    }

    /**
     * DELETE SUB-CATEGORY
     */
    @Delete(':id')
    async delete(@Param() params: IdParamDto) {
        const id = new Types.ObjectId(params.id);

        await this.categoryService.deleteCategory(id);

        return ApiResult.success({ message: 'Category deleted successfully' });
    }

}
