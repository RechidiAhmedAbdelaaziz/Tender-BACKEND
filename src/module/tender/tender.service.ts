import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PartialType } from '@nestjs/swagger';
import { FilterQuery, Model, Types } from 'mongoose';
import { Pagination } from 'src/core/helpers/pagination.helper';
import { CloudinaryService } from 'src/core/module/cloudinary/cloudinary.service';
import { Tender } from 'src/models/tender.entity';

class TenderParams {
    title: string;
    announcer: Types.ObjectId;
    category: Types.ObjectId;
    marketType: Types.ObjectId;
    deadline: Date;
    publicationDate: Date;
    sources: {
        images: Express.Multer.File[];
        newsPaper: Types.ObjectId;
    }[];
    isStartup: boolean;
    region: string;

}

class OptionalTenderParams extends PartialType(TenderParams) { }

@Injectable()
export class TenderService {
    constructor(
        @InjectModel(Tender.name) private readonly tenderModel: Model<Tender>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    create = async (data: TenderParams) => {
        const { title, announcer, category, publicationDate, marketType, region, deadline, sources, isStartup } = data;

        const tender = new this.tenderModel({ title, announcer, region, publicationDate, category, marketType, deadline, isStartup });

        const imageUrls = await Promise.all(sources.map(async source => {
            const { images, newsPaper } = source;
            const urls = await Promise.all(images.map(async image => {
                const url = await this.cloudinaryService.uploadImage(image, {
                    name: `${tender._id}-${newsPaper}-${images.indexOf(image)}`,
                    folder: 'tender',
                });
                return url;
            }));
            return {
                imageUrls: urls,
                newsPaper
            };
        }));

        tender.sources = imageUrls as any;

        await tender.save();
        return this.tenderModel.findById(tender._id).populate('announcer category marketType sources.newsPaper');

    }

    update = async (id: Types.ObjectId, data: OptionalTenderParams) => {
        const { title, announcer, category, publicationDate, marketType, deadline, sources, isStartup, region } = data;

        const tender = await this.tenderModel.findById(id);

        if (title) tender.title = title;
        if (announcer) tender.announcer._id = announcer;
        if (category) tender.category._id = category;
        if (marketType) tender.marketType._id = marketType;
        if (deadline) tender.deadline = deadline;
        if (isStartup !== undefined) tender.isStartup = isStartup;
        if (region) tender.region = region;
        if (publicationDate) tender.publicationDate = publicationDate;


        if (sources) {
            const imageUrls = await Promise.all(sources.map(async source => {
                const { images, newsPaper } = source;
                const urls = await Promise.all(images.map(async image => {
                    const url = await this.cloudinaryService.uploadImage(image, {
                        name: `${tender._id}-${newsPaper}-${images.indexOf(image)}`,
                        folder: 'tender',
                    });
                    return url;
                }));
                return {
                    imageUrls: urls,
                    newsPaper
                };
            }));

            tender.sources = imageUrls as any;
        }

        if (tender.isModified()) return await tender.save();
    }

    delete = async (id: Types.ObjectId) => {
        await this.tenderModel.findByIdAndDelete(id);
    }

    findAll = async (
        filters: {
            category?: Types.ObjectId,
            marketType?: Types.ObjectId,
            announcer?: Types.ObjectId,
            publishedAt?: Date,
            startup?: boolean
        },
        options: {
            keyword?: string,
            sort?: string
            fields?: string,
        },
        pagination: {
            page: number,
            limit: number
        }
    ) => {
        const { page, limit } = pagination;
        const { category, marketType, announcer, publishedAt, startup } = filters;
        const { keyword, fields, sort } = options;

        const filter: FilterQuery<Tender> = {};

        if (keyword) filter.title = { $regex: keyword, $options: 'i' };
        if (category) filter.category = category;
        if (marketType) filter.marketType = marketType;
        if (announcer) filter.announcer = announcer;
        if (publishedAt) filter.createdAt = { $gte: publishedAt };
        if (startup !== undefined) filter.isStartup = startup;

        const { generate, skip } = new Pagination(this.tenderModel, { page, limit, filter }).getOptions();


        return generate(
            await this.tenderModel.find(filter)
                .populate('announcer category marketType')
                .sort(sort)
                .select(fields || 'title announcer category marketType deadline isStartup')
                .skip(skip)
                .limit(limit)
        )
    }

    findOne = async (id: Types.ObjectId) => {
        return await this.tenderModel
            .findById(id)
            .populate('announcer category marketType sources.newsPaper');
    }



}
