import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { TenderService } from './tender.service';
import { CreateTenderBody } from './dto/create-tender.dto';
import { Types } from 'mongoose';
import { ApiResult } from 'src/core/types/api-response';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UpdateTenderBody, UpdateTenderParams } from './dto/update-tender.dto';
import { ListTenderQuery } from './dto/list-tender.dto';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';
import { HttpAuthGuard, Role } from '../auth/guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';


@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@Role(UserRoles.ADMIN)
@Controller('tender')
export class TenderController {
  constructor(private readonly tenderService: TenderService) { }

  /**
   * CREATE TENDER
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async createTender(
    @Body() body: CreateTenderBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {

    const { title, isStartup, region } = body;

    const announcer = new Types.ObjectId(body.announcer);
    const category = new Types.ObjectId(body.category);
    const marketType = new Types.ObjectId(body.marketType);
    const deadline = new Date(body.deadline);
    const publicationDate = new Date(body.publicationDate);
    const sources = body.sources.map(source => ({ //* Show POSTMAN
      images: files.filter(image => image.fieldname === `sources[${body.sources.indexOf(source)}][images]`),
      newsPaper: new Types.ObjectId(source.newsPaper),
    }));


    const tender = await this.tenderService.create({
      publicationDate,
      isStartup,
      title,
      announcer,
      category,
      marketType,
      deadline,
      sources,
      region,
    });

    return ApiResult.success({ data: tender });
  }

  /**
   * UPDATE TENDER
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Patch(':id')
  async updateTender(
    @Param() params: UpdateTenderParams,
    @Body() body: UpdateTenderBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {

    const { title, isStartup, region } = body;

    const announcer = new Types.ObjectId(body.announcer);
    const category = new Types.ObjectId(body.category);
    const marketType = new Types.ObjectId(body.marketType);
    const deadline = new Date(body.deadline);
    const publicationDate = new Date(body.publicationDate);
    const sources = body.sources.map(source => ({ //* Show POSTMAN
      images: files.filter(image => image.fieldname === `sources[${body.sources.indexOf(source)}][images]`),
      newsPaper: new Types.ObjectId(source.newsPaper),
    }));

    const tender = await this.tenderService.update(
      new Types.ObjectId(params.id),
      {
        publicationDate,
        isStartup,
        title,
        announcer,
        category,
        marketType,
        deadline,
        sources,
        region,
      });

    return ApiResult.success({ data: tender });
  }

  /**
   * GET TENDERS (WITH FILTERS)
   */
  @Role(UserRoles.USER)
  @Get()
  async getTenders(
    @Query() query: ListTenderQuery,
  ) {
    const { category, marketType, announcer, publishedAt, startup, keyword, limit, page, sort, fields } = query;

    const result = await this.tenderService.findAll(
      {
        category: category ? new Types.ObjectId(category) : undefined,
        marketType: marketType ? new Types.ObjectId(marketType) : undefined,
        announcer: announcer ? new Types.ObjectId(announcer) : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        startup,
      },
      {
        keyword, sort, fields,
      },
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      }
    );

    return ApiResult.success(result);
  }

  /**
   * DELETE TENDER
   */
  @Delete(':id')
  async deleteTender(
    @Param() params: IdParamDto,
  ) {
    await this.tenderService.delete(new Types.ObjectId(params.id));
    return ApiResult.success({ message: 'Tender deleted successfully' });
  }

  /**
   * GET TENDER BY ID
   */
  @Get(':id')
  async getTender(
    @Param() params: IdParamDto,
  ) {
    const tender = await this.tenderService.findOne(new Types.ObjectId(params.id));
    return ApiResult.success({ data: tender });
  }



}
