import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { MongoRepository } from 'src/core/helpers/mongo.helper';
import { FilterArgs, PaginationArg } from 'src/core/shared/args/pagination.arg';
import { NewsPaper } from 'src/models/news-paper';
import { CreateNewsPaperArgs } from './args/create-npaper.args';
import { UpdateNewsPaperArgs } from './args/update-npaper.args';

@Injectable()
export class NewsPaperService {
    newsPaperRepo: MongoRepository<NewsPaper>;

    constructor(
        @InjectModel(NewsPaper.name) private readonly newsPaperModel: Model<NewsPaper>,
    ) {
        this.newsPaperRepo = new MongoRepository<NewsPaper>(this.newsPaperModel);
    }

    async createNewsPaper(args: CreateNewsPaperArgs) {
        return this.newsPaperRepo.create(args);
    }


    async updateNewsPaper(args: UpdateNewsPaperArgs) {
        const { id, ...rest } = args;
        return this.newsPaperRepo.updateOne({ _id: id }, rest);
    }

    async getNewsPapers(
        filters: FilterArgs,
        paginationArg?: PaginationArg,
    ) {
        const { keyword, fields, sort } = filters || {};

        const filter: FilterQuery<NewsPaper> = {};

        if (keyword) filter.name = { $regex: keyword, $options: 'i' };


        return this.newsPaperRepo.findWithPagination({
            filter: filter,
            options: { sort: { [sort || 'createdAt']: -1 }, fields },
        }, paginationArg);
    }

    async getNewsPaper(id: Types.ObjectId) {
        return this.newsPaperRepo.findOne({ _id: id });
    }

    async deleteNewsPaper(id: Types.ObjectId) {
        return this.newsPaperRepo.deleteOne({ _id: id });
    }



}
