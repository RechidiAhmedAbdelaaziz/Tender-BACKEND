import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AnnouncerService } from './announcer.service';
import { Role } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { ApiResult } from 'src/core/types/api-response';
import { PaginationQuery } from 'src/core/shared/dtos/pagination.dto';
import { IdParams } from 'src/core/shared/dtos/id-param.dto';
import { CreateAnnouncerBody } from './dto/create-announcer.dto';
import { UpdateAnnouncerBody } from './dto/update-annuoncer.dto';

@Controller('announcer')
@Role(UserRoles.ADMIN)
export class AnnouncerController {
  constructor(private readonly announcerService: AnnouncerService) { }


  @Get()
  async getAnnouncers(
    @Query() query: PaginationQuery,
  ): Promise<ApiResult> {
    const { fields, keyword, limit, page, sort } = query;

    return this.announcerService.getAnnouncers({ fields, keyword, sort }, { limit, page });
  }

  @Get(':id')
  async getAnnouncer(
    @Param() params: IdParams,
  ): Promise<ApiResult> {
    const { id } = params;

    const announcer = this.announcerService.getAnnouncer(id);

    return { data: announcer };
  }

  @Post()
  async createAnnouncer(
    @Body() body: CreateAnnouncerBody,
  ): Promise<ApiResult> {
    const { name, imageUri } = body;

    const announcer = await this.announcerService.createAnnouncer({ name, imageUri });

    return { data: announcer };
  }

  @Patch(':id')
  async updateAnnouncer(
    @Param() params: IdParams,
    @Body() body: UpdateAnnouncerBody,
  ): Promise<ApiResult> {
    const { id } = params;
    const { name, imageUri } = body;

    const announcer = await this.announcerService.updateAnnouncer({ id, name, imageUri });

    return { data: announcer };
  }

  @Delete(':id')
  async deleteAnnouncer(
    @Param() params: IdParams,
  ): Promise<ApiResult> {
    const { id } = params;

    const announcer = await this.announcerService.deleteAnnouncer(id);

    return { data: announcer };
  }

}
