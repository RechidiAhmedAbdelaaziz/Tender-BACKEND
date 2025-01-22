import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MongoRepository } from 'src/core/helpers/mongo.helper';
import { Tender } from 'src/models/tender.entity';
import { TenderFilterArgs } from './args/tender-filter.args';
import { FilterArgs, PaginationArg } from 'src/core/shared/args/pagination.arg';
import { title } from 'process';
import { CreateTenderArg, UpdateTenderArg } from './args/tender-details';

@Injectable()
export class TenderService {
    private readonly tnderRepository: MongoRepository<Tender, CreateTenderArg>;
    constructor(
        @InjectModel(Tender.name) private readonly tenderModel: Model<Tender>,
    ) {
        this.tnderRepository = new MongoRepository(tenderModel);
    }

    async findAll(
        tenderFilter: TenderFilterArgs,
        filters: FilterArgs,
        pagination: PaginationArg,
    ) {
        const { keyword, fields, sort } = filters;
        const { announcer, closingBefore, industries, isStartup, marketType, publishedAfter, regions } = tenderFilter;
        return this.tnderRepository.aggregateWithPagination(
            [
                {
                    $lookup: {
                        from: 'announcers',
                        localField: 'announcer',
                        foreignField: '_id',
                        as: 'announcer',
                    },
                },
                {
                    $match: {
                        $and: [
                            title ? { title: { $regex: keyword, $options: 'i' } } : {},
                            announcer ? { 'announcer._id': announcer } : {},
                            publishedAfter ? { publishedAt: { $gte: publishedAfter } } : {},
                            closingBefore ? { closingAt: { $lte: closingBefore } } : {},
                            marketType ? { marketType } : {},
                            industries ? { industries: { $in: industries } } : {},
                            isStartup ? { 'announcer.isStartup': isStartup } : {},
                            regions ? { regions: { $in: regions } } : {},
                        ],
                    },
                },
                {
                    $sort: { [sort || 'publishedAt']: -1 },
                },
                {

                    $project: {
                        title: fields ? fields.includes('title') ? 1 : 0 : 1,
                        announcer: fields ? fields.includes('announcer') ? 1 : 0 : 1,
                        publishedDate: fields ? fields.includes('publishedDate') ? 1 : 0 : 1,
                        closingDate: fields ? fields.includes('closingDate') ? 1 : 0 : 1,
                        chargePrice: fields ? fields.includes('chargePrice') ? 1 : 0 : 1,
                        marketType: fields ? fields.includes('marketType') ? 1 : 0 : 1,
                        industry: fields ? fields.includes('industry') ? 1 : 0 : 1,
                        region: fields ? fields.includes('region') ? 1 : 0 : 1,
                        // sources: fields ? fields.includes('sources') ? 1 : 0 : 1,
                    },

                },
            ],
            pagination,
        );

    }

    async create(data: CreateTenderArg) {
        return this.tnderRepository.create(data);
    }

    async findOne(id: Types.ObjectId) {
        return this.tnderRepository.findOne({ _id: id }); //TODO aggregate to add isFollowed field
    }

    async updateOne(id: Types.ObjectId, data: UpdateTenderArg) {
        const { sources, announcer, chargePrice, closingDate, industry, marketType, publishedDate, region, title } = data;

        const tender = await this.tnderRepository.findOne({ _id: id });

        if (announcer) tender.announcer = announcer as any;
        if (chargePrice) tender.chargePrice = chargePrice;
        if (closingDate) tender.closingDate = closingDate;
        if (industry) tender.industry = industry;
        if (marketType) tender.marketType = marketType;
        if (publishedDate) tender.publishedDate = publishedDate;
        if (region) tender.region = region;
        if (title) tender.title = title;
        if (sources) {
            sources.forEach(source => {
                const index = tender.sources.findIndex(s => source.newsPaper.equals(s.newsPaper._id));
                if (index === -1 && source.imagesToAdd && source.imagesToAdd.length > 0) {
                    tender.sources.push({
                        newsPaper: source.newsPaper as any,
                        images: source.imagesToAdd,
                    })
                } else {
                    const { imagesToAdd, imagesToRemove } = source;
                    if (imagesToAdd) tender.sources[index].images.push(...imagesToAdd);
                    if (imagesToRemove) {
                        tender.sources[index].images = tender.sources[index].images.filter(i => !imagesToRemove.includes(i));

                        // Remove the source if it has no images
                        if (tender.sources[index].images.length === 0) tender.sources.splice(index, 1);
                    }
                }
            });

            tender.markModified('sources');
        }

        if (tender.isModified()) await tender.save();
        return await tender.populate(['announcer', 'sources.newsPaper']);

    }

    async deleteOne(id: Types.ObjectId) {
        return this.tnderRepository.deleteOne({ _id: id });
    }

}
