import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/core/module/cloudinary/cloudinary.service';
import { Result } from 'src/models/result.entity';
import { ResultParams, UpdateResultParams } from './params/result.params';
import { ResultFilter } from './params/result-filter';
import { Pagination } from 'src/core/helpers/pagination.helper';


@Injectable()
export class ResultService {

    constructor(
        @InjectModel(Result.name) private readonly resultModel: Model<Result>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    create = async (data: ResultParams) => {
        const { title, announcer, type, tender, sources } = data;

        const result = new this.resultModel({ title, announcer, type, tender });

        const imageUrls = await Promise.all(sources.map(async source => {
            const { images, newsPaper } = source;
            const urls = await Promise.all(images.map(async image => {
                const url = await this.cloudinaryService.uploadImage(image, {
                    name: `${result._id}-${newsPaper}-${images.indexOf(image)}`,
                    folder: 'result',
                });
                return url;
            }));
            return {
                imageUrls: urls,
                newsPaper
            };
        }));

        result.sources = imageUrls as any;

        await result.save();
        return this.resultModel.findById(result._id).populate('announcer tender sources.newsPaper');
    }

    update = async (id: Types.ObjectId, data: UpdateResultParams) => {
        const { title, announcer, type, tender, sources } = data;

        const result = await this.resultModel.findById(id);

        if (title) result.title = title;
        if (announcer) result.announcer._id = announcer;
        if (type) result.type = type;
        if (tender) result.tender._id = tender;

        if (sources) {
            const imageUrls = await Promise.all(sources.map(async source => {
                const { images, newsPaper } = source;
                const urls = await Promise.all(images.map(async image => {
                    const url = await this.cloudinaryService.uploadImage(image, {
                        name: `${result._id}-${newsPaper}-${images.indexOf(image)}`,
                        folder: 'result',
                    });
                    return url;
                }));
                return {
                    imageUrls: urls,
                    newsPaper
                };
            }));

            result.sources = imageUrls as any;
        }


        if (result.isModified()) {
            await result.save();
            return this.resultModel.findById(result._id).populate('announcer tender sources.newsPaper');
        }

    }

    delete = async (id: Types.ObjectId) => {
        return this.resultModel.findByIdAndDelete(id);
    }

    findAll = async (
        filters: ResultFilter,
        options: {
            keyword: string;
            sort: string;
            fields: string;
        },
        pagination: {
            page: number;
            limit: number;
        }
    ) => {
        const { keyword, sort, fields } = options;
        const { page, limit } = pagination;
        const { announcer, tender, type, publishedAt } = filters;

        const filter: FilterQuery<Result> = {};

        if (announcer) filter.announcer = announcer;
        if (tender) filter.tender = tender;
        if (type) filter.type = type;
        if (publishedAt) filter.createdAt = { $gte: publishedAt };
        if (keyword) filter.title = { $regex: keyword, $options: 'i' };


        const { generate, skip } = new Pagination(this.resultModel, { page, limit, filter }).getOptions();


        return generate(
            await this.resultModel
                .find(filter)
                .populate('announcer tender sources.newsPaper')
                .sort(sort)
                .select(fields || 'title announcer type')
                .skip(skip)
                .limit(limit)
        );
    }

    findOne = async (id: Types.ObjectId) => {
        return this.resultModel
        .findById(id)
        .populate('announcer tender sources.newsPaper');
    }


}
