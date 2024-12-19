

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubCategory } from 'src/models/sub-category.dto';

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
    ) { }


    async findAll(categoryId?: Types.ObjectId) {
        return await this.subCategoryModel
            .find(categoryId ? { category: categoryId } : {})
            .populate('category');
    }

    async createCategory(data: {
        name: string,
        categoryId: Types.ObjectId
    }) {
        const { name, categoryId } = data;

        await this.checkExistence(name);

        const category = new this.subCategoryModel({ name: name, category: categoryId });

        await category.save();
        return await this.getById(category._id);
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
        const result = await this.subCategoryModel
            .findById(id)
            .populate('category');

        if (!result) throw new HttpException('Category not found', 404);

        return result;
    }

    async checkExistence(name: string) {
        const category = await this.subCategoryModel.findOne({ name });
        if (category) throw new HttpException('Category already exists', 400);
    }

}
