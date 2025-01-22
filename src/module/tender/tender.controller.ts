import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderFilterQuery } from './dto/tender-filter.dto';
import { query } from 'express';
import { IdParams } from 'src/core/shared/dtos/id-param.dto';
import { ApiResult } from 'src/core/types/api-response';
import { CreateTenderBody } from './dto/create-tender.dto';
import { UpdateTenderBody } from './dto/update-tender.dto';

@Controller('tender')
export class TenderController {
  constructor(private readonly tenderService: TenderService) { }

  @Get()
  async getTenders(
    @Query() query: TenderFilterQuery,
  ): Promise<ApiResult<any>> {
    const { page, limit, sort, keyword, fields, ...filterArgs } = query

    const { pagination, data } = await this.tenderService.findAll(filterArgs, { sort, fields, keyword }, { page, limit })

    return { pagination, data }
  }

  @Get(':id')
  async getTender(
    @Param() params: IdParams,
  ) {
    const tender = await this.tenderService.findOne(params.id)
    return { data: tender }
  }

  @Post()
  async createTender(
    @Body() data: CreateTenderBody,
  ) {
    const tender = await this.tenderService.create(data)
    return { data: tender }
  }

  @Patch(':id')
  async updateTender(
    @Param() params: IdParams,
    @Body() data: UpdateTenderBody,
  ) {
    const tender = await this.tenderService.updateOne(params.id, data)
    return { data: tender }
  }

  @Delete(':id')
  async deleteTender(
    @Param() params: IdParams,
  ) {
    const tender = await this.tenderService.deleteOne(params.id)
    return { data: tender }
  }


}
