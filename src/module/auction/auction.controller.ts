import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateAuctionBody } from './dto/create-auction.dto';
import { Types } from 'mongoose';
import { ApiResult } from 'src/core/types/api-response';
import { UpdateAuctionBody, UpdateAuctionParams } from './dto/update-auction.dto';
import { IdParamDto } from 'src/core/shared/dtos/id-param.dto';
import { PaginationQueryDto } from 'src/core/shared/dtos/pagination.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) { }


  /**
   * CREATE AUCTION
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async createAuction(
    @Body() body: CreateAuctionBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { title, type, deadline } = body;

    const sources = body.newsPapers.map(newsPaper => ({ //* Show POSTMAN
      images: files.filter(image => image.fieldname === `sources[${body.newsPapers.indexOf(newsPaper)}][images]`),
      newsPaper: new Types.ObjectId(newsPaper),
    }));

    const result = await this.auctionService.create({
      title,
      type,
      sources,
      deadline,
    });

    return ApiResult.success({ data: result });
  }

  /**
   * UPDATE AUCTION
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Patch(':id')
  async updateAuction(
    @Param() params: UpdateAuctionParams,
    @Body() body: UpdateAuctionBody,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { title, type, deadline } = body;

    const sources = body.newsPapers.map(newsPaper => ({
      images: files.filter(image => image.fieldname === `sources[${body.newsPapers.indexOf(newsPaper)}][images]`),
      newsPaper: new Types.ObjectId(newsPaper),
    }));

    const result = await this.auctionService.update(
      new Types.ObjectId(params.id),
      {
        title,
        type,
        sources,
        deadline,
      },
    );

    return ApiResult.success({ data: result });
  }

  /**
   * DELETE AUCTION
   */
  @Delete(':id')
  async deleteAuction(@Param() params: IdParamDto) {
    await this.auctionService.delete(new Types.ObjectId(params.id));

    return ApiResult.success({ message: 'Auction deleted successfully' });
  }

  /**
   * GET ALL AUCTIONS
   */
  @Get()
  async getAllAuctions(
    @Query() query: PaginationQueryDto,
  ) {
    const { page, limit, fields, keyword, sort } = query;

    const { data, pagination } = await this.auctionService.findAll(
      {
        keyword,
        sort,
        fields,
      },
      {
        page,
        limit,
      },
    )

    return ApiResult.success({ data, pagination });
  }

  /**
   * GET AUCTION BY ID
   */
  @Get(':id')
  async getAuctionById(@Param() params: IdParamDto) {
    const result = await this.auctionService.findOne(new Types.ObjectId(params.id));

    return ApiResult.success({ data: result });
  }


}
