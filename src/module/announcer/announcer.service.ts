import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { MongoRepository } from 'src/core/helpers/mongo.helper';
import { Announcer } from 'src/models/announcer.entity';
import { CreateAnnouncerArgs } from './args/create-announcer.args';
import { UpdateAnnouncerArgs } from './args/update-announcer.args';
import { FilterArgs, PaginationArg } from 'src/core/shared/args/pagination.arg';

@Injectable()
export class AnnouncerService {
    announcerRepo: MongoRepository<Announcer>;

    constructor(
        @InjectModel(Announcer.name) private readonly announcerModel: Model<Announcer>,
    ) {
        this.announcerRepo = new MongoRepository<Announcer>(this.announcerModel);
    }

    async createAnnouncer(args: CreateAnnouncerArgs) {
        return this.announcerRepo.create(args);
    }


    async updateAnnouncer(args: UpdateAnnouncerArgs) {
        const { id, ...rest } = args;
        return this.announcerRepo.updateOne({ _id: id }, rest);
    }

    async getAnnouncers(
        filters: FilterArgs,
        paginationArg?: PaginationArg,
    ) {
        const { keyword, fields, sort } = filters || {};

        const filterQuery: FilterQuery<Announcer> = {};

        if (keyword) filterQuery.name = { $regex: keyword, $options: 'i' };

        return this.announcerRepo.findWithPagination({
            filter: filterQuery,
            options: { sort: { [sort || 'createdAt']: -1 }, fields },
        }, paginationArg);
    }

    async getAnnouncer(id: Types.ObjectId) {
        return this.announcerRepo.findOne({ _id: id });
    }

    async deleteAnnouncer(id: Types.ObjectId) {
        return this.announcerRepo.deleteOne({ _id: id });
    }



}
