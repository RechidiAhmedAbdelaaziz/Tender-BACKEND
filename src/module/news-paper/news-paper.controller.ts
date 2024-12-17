import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NewsPaperService } from './news-paper.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { HttpAuthGuard, SetRole } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewspaperDto } from './dto/create-newspaper.dto';
import { ApiResponse } from 'src/core/types/api-response';
import { PaginationQueryDto } from 'src/core/shared/dtos/pagination.dto';
import { UpdateNewspaperBodyDto, UpdateNewspaperParamsDto } from './dto/update-newpapper.dto';
import { Types } from 'mongoose';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';

@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@SetRole(UserRoles.ADMIN)
@Controller('news-paper')
export class NewsPaperController {
  constructor(private readonly newsPaperService: NewsPaperService) { }


  /**
   * CREATE
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() body: CreateNewspaperDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    const { name } = body;

    const data = await this.newsPaperService.create({ image, name });
    return ApiResponse.success({ data });

  }

  /**
   * GET ALL
   */
  @Get()
  async getAll(@Query() query: PaginationQueryDto) {
    const { page, limit } = query;

    const result = await this.newsPaperService.findAll({ page, limit });

    return ApiResponse.success(result);
  }

  /**
   * UPDATE
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async update(
    @Param() params: UpdateNewspaperParamsDto,
    @Body() body: UpdateNewspaperBodyDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    const { name } = body;
    const { id } = params;

    const data = await this.newsPaperService
      .update(new Types.ObjectId(id), { image, name });

    return ApiResponse.success({ data });
  }

  /**
   * DELETE
   */
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    const { id } = params;
    await this.newsPaperService.delete(new Types.ObjectId(id));
    return ApiResponse.success({ message: 'News paper deleted successfully' });
  }


}
