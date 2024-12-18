import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MarketTypeService } from './market-type.service';
import { ApiResult } from 'src/core/types/api-response';
import { CreateMarketTypeBodyDto } from './dto/create-markettype.dto';
import { UpdateMarketTypeParamsDto, UpdateMarketTypeBodyDto } from './dto/update-markettype.dto';
import { Types } from 'mongoose';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { HttpAuthGuard, Role } from '../auth/guards/auth.guard';
@Role(UserRoles.ADMIN)
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Controller('market-type')
export class MarketTypeController {
  constructor(private readonly marketTypeService: MarketTypeService) { }

  /**
   * GET ALL MARKET TYPES
   */
  @Role(UserRoles.USER)
  @Get()
  async getAll() {
    const result = await this.marketTypeService.findAll();

    return ApiResult.success({ data: result });
  }

  /**
   * CREATE MARKET TYPE
   */
  @Post()
  async create(@Body() body: CreateMarketTypeBodyDto) {
    const { name } = body;

    const data = await this.marketTypeService.create({ name });

    return ApiResult.success({ data });
  }

  /**
   * UPDATE MARKET TYPE
   */
  @Patch(':id')
  async update(
    @Param() params: UpdateMarketTypeParamsDto,
    @Body() body: UpdateMarketTypeBodyDto
  ) {
    const { name } = body;
    const id = new Types.ObjectId(params.id);

    const data = await this.marketTypeService.update(id, { name });

    return ApiResult.success({ data });
  }

  /**
   * DELETE MARKET TYPE
   */
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    const id = new Types.ObjectId(params.id);

    await this.marketTypeService.delete(id);

    return ApiResult.success({ message: 'Market type deleted' });
  }


}
