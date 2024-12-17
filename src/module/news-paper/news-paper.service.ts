import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/core/module/cloudinary/cloudinary.service';
import { NewsPaper } from 'src/models/news-paper.entity';
import { Pagination } from 'src/core/helpers/pagination.helper';


@Injectable()
export class NewsPaperService {

    constructor(
        @InjectModel(NewsPaper.name) private readonly newsPaperModel: Model<NewsPaper>,
        private readonly cloudinaryHelper: CloudinaryService,
    ) { }

    async findAll(pagination: { page: number, limit: number }) {
        const { page, limit } = pagination;

        const { generate, skip } = new Pagination(this.newsPaperModel, { page, limit })
            .getOptions();

        return await generate(
            await this.newsPaperModel
                .find()
                .skip(skip)
                .limit(limit)
        );

    }

    async create(data: {
        image: Express.Multer.File,
        name: string
    }) {
        const { name, image } = data;

        await this.checkExistence(name);

        const newsPaper = new this.newsPaperModel({ name: name });

        const imageUrl = await this.cloudinaryHelper.uploadImage(image, {
            name: newsPaper._id.toHexString(),
            folder: 'news-paper'
        });

        newsPaper.imageUrl = imageUrl;

        return await newsPaper.save();
    }

    async update(id: Types.ObjectId, data: {
        image: Express.Multer.File,
        name: string
    }) {
        const { name, image } = data;

        const newsPaper = await this.getById(id);

        if (name) {
            await this.checkExistence(name);
            newsPaper.name = name;
        }

        if (image) {
            const imageUrl = await this.cloudinaryHelper.uploadImage(image, {
                name: newsPaper._id.toHexString(),
                folder: 'news-paper'
            });
            newsPaper.imageUrl = imageUrl;
        }

        if (newsPaper.isModified()) return await newsPaper.save();
    }

    async delete(id: Types.ObjectId) {
        const newsPaper = await this.getById(id);

        await this.cloudinaryHelper.deleteImage(newsPaper._id.toHexString());

        await newsPaper.deleteOne();
    }



    private async getById(id: Types.ObjectId) {
        const newsPaper = await this.newsPaperModel.findById(id);
        if (!newsPaper) throw new HttpException('News paper not found', 404);
        return newsPaper;
    }


    private async checkExistence(name: string,) {
        const newsPaper = await this.newsPaperModel.findOne({ name });
        if (newsPaper) throw new HttpException('News paper already exists', 400);
    }
}
