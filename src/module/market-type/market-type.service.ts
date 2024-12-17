import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MarketType } from 'src/models/market-type.entity';

@Injectable()
export class MarketTypeService {

    constructor(
        @InjectModel(MarketType.name) private readonly marketTypeModel: Model<MarketType>,
    ) { }

    async findAll() {
        return await this.marketTypeModel.find();
    }

    async create(data: {
        name: string
    }) {
        const { name } = data;

        await this.checkExistence(name);

        const marketType = new this.marketTypeModel({ name: name });

        return await marketType.save();
    }

    async update(id: Types.ObjectId, data: {
        name: string
    }) {
        const { name } = data;

        const marketType = await this.getById(id);

        if (name) {
            await this.checkExistence(name);
            marketType.name = name;
        }

        if (marketType.isModified()) return await marketType.save();

    }

    async delete(id: Types.ObjectId) {
        const marketType = await this.getById(id);

        await marketType.deleteOne();
    }

    async getById(id: Types.ObjectId) {
        const result = await this.marketTypeModel.findById(id);
        if (!result) throw new HttpException('Market type not found', 404);

        return result;
    }

    async checkExistence(name: string) {
        const marketType = await this.marketTypeModel.findOne({ name });

        if (marketType) throw new HttpException('Market type already exists', 400);

    }
}
