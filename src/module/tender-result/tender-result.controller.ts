import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TenderResultService } from './tender-result.service';
import { TenderResultFilterQuery } from './dto/tender-result-filter.dto';
import { ApiResult } from 'src/core/types/api-response';
import { IdParams } from 'src/core/shared/dtos/id-param.dto';
import { CreateResultBody } from './dto/create-result.dto';
import { UpdateResultBody } from './dto/update-result.dto';

@Controller('tender-result')
export class TenderResultController {
  constructor(private readonly tenderResultService: TenderResultService) { }

  @Get()
  async getAll(
    @Query() filters: TenderResultFilterQuery,
  ): Promise<ApiResult> {
    const { fields, keyword, limit, page, sort, ...resultFilters } = filters;

    const { data, pagination } = await this.tenderResultService.getAll(resultFilters, { fields, keyword, sort }, { limit, page })

    return { data, pagination }
  }

  @Get(':id')
  async getOne(
    @Param() params: IdParams,
  ) {
    const tenderResult = await this.tenderResultService.getOne(params.id);

    return { data: tenderResult }
  }

  @Post()
  async createOne(
    @Body() data: CreateResultBody,
  ) {
    const result = await this.tenderResultService.createOne(data);

    return { data: result }
  }

  @Patch(':id')
  async updateOne(
    @Param() params: IdParams,
    @Body() data: UpdateResultBody,
  ) {
    const result = await this.tenderResultService.updateOne(params.id, data);

    return { data: result }
  }

  @Delete(':id')
  async deleteOne(
    @Param() params: IdParams,
  ) {
    const tenderResult = await this.tenderResultService.deleteOne(params.id);

    return { data: tenderResult }
  }

}
