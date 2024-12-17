import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/models/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    ) { }


    async findAll() {
        return await this.categoryModel.find();
    }

    async createCategory(data: {
        name: string
    }) {
        const { name } = data;

        await this.checkExistence(name);

        const category = new this.categoryModel({ name: name });

        return await category.save();
    }

    async updateCategory(id: Types.ObjectId, data: {
        name: string
    }) {
        const { name } = data;

        const category = await this.getById(id);

        if (name) {
            await this.checkExistence(name);
            category.name = name;
        }

        if (category.isModified()) return await category.save();
    }

    async deleteCategory(id: Types.ObjectId) {
        const category = await this.getById(id);

        await category.deleteOne();
    }

    async getById(id: Types.ObjectId) {
        const result = await this.categoryModel.findById(id);
        if (!result) throw new HttpException('Category not found', 404);

        return result;
    }

    async checkExistence(name: string) {
        const category = await this.categoryModel.findOne({ name });
        if (category) throw new HttpException('Category already exists', 400);
    }




}
