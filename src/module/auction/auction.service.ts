import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/core/module/cloudinary/cloudinary.service';
import { Auction } from 'src/models/auction.entity';
import { AuctionParams, OptionalAuctionParams } from './params/auction.param';
import { Pagination } from 'src/core/helpers/pagination.helper';

@Injectable()
export class AuctionService {

    constructor(
        @InjectModel(Auction.name) private readonly auctionModel: Model<Auction>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    create = async (data: AuctionParams) => {
        const { title, type, deadline, sources } = data;

        const auction = new this.auctionModel({ title, type, deadline });

        const imageUrls = await Promise.all(sources.map(async source => {
            const { images, newsPaper } = source;
            const urls = await Promise.all(images.map(async image => {
                const url = await this.cloudinaryService.uploadImage(image, {
                    name: `${auction._id}-${newsPaper}-${images.indexOf(image)}`,
                    folder: 'auction',
                });
                return url;
            }));
            return {
                imageUrls: urls,
                newsPaper
            };
        }));

        auction.sources = imageUrls as any;

        await auction.save();
        return this.auctionModel.findById(auction._id);
    }

    update = async (id: Types.ObjectId, data: OptionalAuctionParams) => {
        const { title, type, deadline, sources } = data;

        const auction = await this.auctionModel.findById(id);

        if (title) auction.title = title;
        if (type) auction.type = type;
        if (deadline) auction.deadline = deadline;

        if (sources) {
            const imageUrls = await Promise.all(sources.map(async source => {
                const { images, newsPaper } = source;
                const urls = await Promise.all(images.map(async image => {
                    const url = await this.cloudinaryService.uploadImage(image, {
                        name: `${auction._id}-${newsPaper}-${images.indexOf(image)}`,
                        folder: 'auction',
                    });
                    return url;
                }));
                return {
                    imageUrls: urls,
                    newsPaper
                };
            }));

            auction.sources = imageUrls as any;
        }

        if (auction.isModified()) await auction.save();

        return this.auctionModel.findById(auction._id);
    }

    delete = async (id: Types.ObjectId) => {
        await this.auctionModel.findByIdAndDelete(id);
    }

    findAll = async (
        options: {
            keyword?: string;
            sort?: string;
            fields?: string;

        },
        pagination: {
            page?: number;
            limit?: number;
        }
    ) => {
        const { keyword, sort, fields } = options;
        const { page, limit } = pagination;

        const filter: FilterQuery<Auction> = {}

        if (keyword) {
            const keywords = keyword.split(' ').map(keyword => new RegExp(keyword, 'i'));
            filter.$or = [{ title: { $in: keywords } }, { type: { $in: keywords } }];
        }

        const { generate, skip } = new Pagination(this.auctionModel, { filter, page, limit }).getOptions();


        return generate(
            await this.auctionModel
                .find(filter)
                .sort(sort)
                .select(fields)
                .skip(skip)
                .limit(limit)
        )
    }

    findOne = async (id: Types.ObjectId) => {
        return await this.auctionModel
            .findById(id)
            .populate('sources.newsPaper')
    }
}
