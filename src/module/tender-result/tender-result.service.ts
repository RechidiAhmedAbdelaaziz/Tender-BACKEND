import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateResult } from 'mongoose';
import { MongoRepository } from 'src/core/helpers/mongo.helper';
import { TenderResult } from 'src/models/tender-result.entity';
import { TenderResultFilterArgs } from './args/result-filter.args';
import { FilterArgs, PaginationArg } from 'src/core/shared/args/pagination.arg';
import { CreateResultArgs, UpdateResultArgs } from './args/result-details.args';

@Injectable()
export class TenderResultService {
    private readonly tenderResultRepo: MongoRepository<TenderResult>

    constructor(
        @InjectModel(TenderResult.name) private readonly tenderResultModel: Model<TenderResult>
    ) {
        this.tenderResultRepo = new MongoRepository<TenderResult>(this.tenderResultModel);
    }

    async getAll(
        resultFilter: TenderResultFilterArgs,
        filters: FilterArgs,
        pagination: PaginationArg,

    ) {
        const { publishedAfter, region, tender, type } = resultFilter;
        const { fields, keyword, sort } = filters;

        const filter: FilterQuery<TenderResult> = {};

        if (keyword) filter.title = { $regex: keyword, $options: 'i' };
        if (publishedAfter) filter.publishedDate = { $gte: publishedAfter };
        if (region) filter.region = region;
        if (tender) filter.tender = tender;
        if (type) filter.type = type;


        return this.tenderResultRepo.findWithPagination({
            filter: filter,
            options: { sort: { [sort || 'createdAt']: -1 }, fields: fields },
            populate: [{
                path: 'tender',
                select: 'title announcer',
                populate: ['announcer']
            },
            {
                path: 'sources.newsPaper',
                select: '_id'
            }
            ]
        }, pagination)
    }

    async getOne(id: Types.ObjectId) {
        return this.tenderResultRepo.findOne({ _id: id }, {}, {}, [
            {
                path: 'tender',
                select: 'title announcer',
                populate: ['announcer']
            },
            {
                path: 'sources.newsPaper',
            }
        ]);
    }

    async deleteOne(id: Types.ObjectId) {
        return this.tenderResultRepo.deleteOne({ _id: id });
    }

    async createOne(data: CreateResultArgs) {
        const tender = await this.tenderResultRepo.create(data);
        return await this.tenderResultRepo.findOne({ _id: tender._id }, {}, {}, [
            {
                path: 'tender',
                select: 'title announcer',
                populate: ['announcer']
            },
            {
                path: 'sources.newsPaper',
                select: '_id'
            }
        ]);
    }

    async updateOne(id: Types.ObjectId, data: UpdateResultArgs) {
        const { publishedDate, region, sources, tender, title, type } = data;

        const result = await this.tenderResultRepo.findOne({ _id: id });

        if (publishedDate) result.publishedDate = publishedDate;
        if (region) result.region = region;
        if (tender) result.tender = tender as any;
        if (title) result.title = title;
        if (type) result.type = type;
        if (sources) {
            sources.forEach(source => {
                const index = result.sources.findIndex(s => s.newsPaper._id.equals(source.newsPaper));
                if (index === -1 && source.imagesToAdd && source.imagesToAdd.length > 0) {
                    result.sources.push({
                        newsPaper: source.newsPaper as any,
                        images: source.imagesToAdd,
                    });
                } else {
                    if (source.imagesToAdd) {
                        result.sources[index].images.push(...source.imagesToAdd);
                    }
                    if (source.imagesToRemove) {
                        result.sources[index].images = result.sources[index].images.filter(i => !source.imagesToRemove.includes(i));

                        if (result.sources[index].images.length === 0) {
                            result.sources.splice(index, 1);
                        }
                    }

                    result.markModified('sources');
                }
            })
        }

        if (result.isModified()) await result.save();
        return await this.tenderResultRepo.findOne({ _id: id }, {}, {}, [
            {
                path: 'tender',
                select: 'title announcer',
                populate: ['announcer']
            },
            {
                path: 'sources.newsPaper',
                select: '_id'
            }
        ]);
    }


}
