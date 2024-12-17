import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnnouncerService } from './announcer.service';
import { ListAnnouncerQueryDTO } from './dto/list-announcer.dto';
import { ApiResult } from 'src/core/types/api-response';
import { CreateAnnouncerBodyDTO } from './dto/create-announcer.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { HttpAuthGuard, Role } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAnnouncerBodyDTO, UpdateAnnouncerParamsDTO } from './dto/update-announcer.dto';
import { Types } from 'mongoose';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';


@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Role(UserRoles.ADMIN)
@Controller('announcer')
export class AnnouncerController {
  constructor(private readonly announcerService: AnnouncerService) { }

  /** 
    * GET ALL ANNOUNCERS
    */
  @Role(UserRoles.USER)
  @Get()
  async findAll(
    @Query() query: ListAnnouncerQueryDTO
  ) {
    const { keyword, page, limit } = query;

    const result = await this.announcerService.findAll({ keyword }, { page, limit });

    return ApiResult.success(result);
  }

  /**
   * CREATE ANNOUNCER
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() body: CreateAnnouncerBodyDTO,
    @UploadedFile() image: Express.Multer.File
  ) {
    const { name, about } = body;

    const data = await this.announcerService.create({ name, image, about });

    return ApiResult.success({ data });
  }

  /**
   * UPDATE ANNOUNCER
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async update(
    @Param() params: UpdateAnnouncerParamsDTO,
    @Body() body: UpdateAnnouncerBodyDTO,
    @UploadedFile() image: Express.Multer.File
  ) {
    const { name, about } = body;
    const id = new Types.ObjectId(params.id);

    const data = await this.announcerService.update(id, { name, image, about });

    return ApiResult.success({ data });
  }

  /**
   * DELETE ANNOUNCER
   */
  @Delete(':id')
  async delete(
    @Param() params: IdParamDto
  ) {
    const id = new Types.ObjectId(params.id);

    await this.announcerService.delete(id);

    return ApiResult.success({ message: 'Announcer deleted successfully' });
  }


}
