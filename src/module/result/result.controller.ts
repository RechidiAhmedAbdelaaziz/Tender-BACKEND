import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ResultService } from './result.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateResultBody } from './dto/create-result.dto';
import { Types } from 'mongoose';
import { ApiResult } from 'src/core/types/api-response';
import { UpdateResultBody, UpdateResultParams } from './dto/update-result.dto';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';
import { ListResultQuery } from './dto/list-result.dto';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) { }

  /**
   * CREATE RESULT
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async createResult(
    @Body() body: CreateResultBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {

    const { title, type ,deadline} = body;

    const announcer = new Types.ObjectId(body.announcer);
    const tender = new Types.ObjectId(body.tender);
    const sources = body.newsPapers.map(newsPaper => ({ //* Show POSTMAN
      images: files.filter(image => image.fieldname === `sources[${body.newsPapers.indexOf(newsPaper)}][images]`),
      newsPaper: new Types.ObjectId(newsPaper),
    }));

    const result = await this.resultService.create({
      title,
      announcer,
      tender,
      type,
      sources,
      deadline
    });

    return ApiResult.success({ data: result });
  }

  /**
   * UPDATE RESULT
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Patch(':id')
  async updateResult(
    @Param() params: UpdateResultParams,
    @Body() body: UpdateResultBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {

    const { title, type ,deadline} = body;

    const announcer = new Types.ObjectId(body.announcer);
    const tender = new Types.ObjectId(body.tender);
    const sources = body.newsPapers.map(newsPaper => ({ //* Show POSTMAN
      images: files.filter(image => image.fieldname === `sources[${body.newsPapers.indexOf(newsPaper)}][images]`),
      newsPaper: new Types.ObjectId(newsPaper),
    }));

    const result = await this.resultService.update(
      new Types.ObjectId(params.id),
      {
        title,
        announcer,
        tender,
        type,
        sources,
        deadline,
      }
    );

    return ApiResult.success({ data: result });
  }

  /**
   * DELETE RESULT
   */
  @Delete(':id')
  async deleteResult(@Param() params: IdParamDto) {
    await this.resultService.delete(new Types.ObjectId(params.id));
    return ApiResult.success({ message: 'Result deleted successfully' });
  }

  /**
   * GET ALL  RESULTS
   */
  @Get()
  async getAllResults(
    @Query() query: ListResultQuery,
  ) {
    const { page, limit, keyword, announcer, fields, publishedAt, sort, tender, type } = query;

    const result = await this.resultService.findAll(
      {
        announcer: announcer ? new Types.ObjectId(announcer) : undefined,
        tender: tender ? new Types.ObjectId(tender) : undefined,
        type,
        publishedAt,
      },
      {
        keyword,
        sort,
        fields,
      },
      {
        page,
        limit,
      }
    );

    return ApiResult.success(result);
  }

  /** 
   * GET RESULT BY ID
   */
  @Get(':id')
  async getResultById(@Param() params: IdParamDto) {
    const result = await this.resultService.findOne(new Types.ObjectId(params.id));
    return ApiResult.success({ data: result });
  }


}
