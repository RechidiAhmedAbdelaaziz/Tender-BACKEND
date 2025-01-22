import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NewsPaperService } from './news-paper.service';
import { IdParams } from 'src/core/shared/dtos/id-param.dto';
import { PaginationQuery } from 'src/core/shared/dtos/pagination.dto';
import { ApiResult } from 'src/core/types/api-response';
import { CreateNewsPaperBody } from './dto/create-npaper.dto';
import { UpdateNewsPaperBody } from './dto/update-npaper.dto';

@Controller('news-paper')
export class NewsPaperController {
  constructor(private readonly newsPaperService: NewsPaperService) {}


  
    @Get()
    async getNewsPapers(
      @Query() query: PaginationQuery,
    ): Promise<ApiResult> {
      const { fields, keyword, limit, page, sort } = query;
  
      return this.newsPaperService.getNewsPapers({ fields, keyword, sort }, { limit, page });
    }
  
    @Get(':id')
    async getNewsPaper(
      @Param() params: IdParams,
    ): Promise<ApiResult> {
      const { id } = params;
  
      const newsPaper = this.newsPaperService.getNewsPaper(id);
  
      return { data: newsPaper };
    }
  
    @Post()
    async createNewsPaper(
      @Body() body: CreateNewsPaperBody,
    ): Promise<ApiResult> {
      const { name, imageUri } = body;
  
      const newsPaper = await this.newsPaperService.createNewsPaper({ name, imageUri });
  
      return { data: newsPaper };
    }
  
    @Patch(':id')
    async updateNewsPaper(
      @Param() params: IdParams,
      @Body() body: UpdateNewsPaperBody,
    ): Promise<ApiResult> {
      const { id } = params;
      const { name, imageUri } = body;
  
      const newsPaper = await this.newsPaperService.updateNewsPaper({ id, name, imageUri });
  
      return { data: newsPaper };
    }
  
    @Delete(':id')
    async deleteNewsPaper(
      @Param() params: IdParams,
    ): Promise<ApiResult> {
      const { id } = params;
  
      const newsPaper = await this.newsPaperService.deleteNewsPaper(id);
  
      return { data: newsPaper };
    }
  
}
