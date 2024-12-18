import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pagination } from 'src/core/helpers/pagination.helper';
import { CloudinaryService } from 'src/core/module/cloudinary/cloudinary.service';
import { Announcer } from 'src/models/announcer.entity';

@Injectable()
export class AnnouncerService {
    constructor(
        @InjectModel(Announcer.name) private readonly announcerModel: Model<Announcer>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    findAll = async (
        options: { keyword?: string },
        pagination: { page: number, limit: number }) => {
        const { keyword } = options || {};
        const { page, limit } = pagination

        const query = this.announcerModel.find();

        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            query.or([{ name: reg }]);

        }

        const { generate, skip } = new Pagination(
            this.announcerModel,
            { page, limit, filter: query.getFilter() }
        ).getOptions();

        return await generate(
            await query
                .skip(skip)
                .limit(limit)
        );
    }

    create = async (data: {
        name: string;
        about: string;
        image: Express.Multer.File;
    }) => {
        const { name, about, image } = data;

        await this.checkExistence(name);

        const announcer = new this.announcerModel({ name, about });

        const imageUrl = await this.cloudinaryService.uploadImage(image, {
            name: announcer._id.toHexString(),
            folder: 'announcer'
        });

        announcer.imageUrl = imageUrl;

        return announcer.save();
    }

    update = async (id: Types.ObjectId, data: {
        name?: string;
        about?: string;
        image?: Express.Multer.File;
    }) => {
        const { name, about, image } = data;

        const announcer = await this.getById(id);

        if (name) {
            await this.checkExistence(name);
            announcer.name = name;
        }

        if (about) announcer.about = about;

        if (image) {
            const imageUrl = await this.cloudinaryService.uploadImage(image, {
                name: announcer._id.toHexString(),
                folder: 'announcer'
            });
            announcer.imageUrl = imageUrl;
        }

        if (announcer.isModified()) return await announcer.save();
    }

    delete = async (id: Types.ObjectId) => {
        const announcer = await this.getById(id);
        // await this.cloudinaryService.deleteImage(announcer._id.toHexString());
        await announcer.deleteOne();
    }

    private getById = async (id: Types.ObjectId) => {
        const announcer = await this.announcerModel.findById(id);
        if (!announcer) throw new HttpException('Announcer not found', 404);
        return announcer;
    }

    private checkExistence = async (name: string) => {
        const announcer = await this.announcerModel.find({ name });
        if (announcer.length) throw new HttpException('Announcer already exists', 400);
    }
}
