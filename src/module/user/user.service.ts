import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CryptHelper } from 'src/core/helpers/crypt.helper';
import { Pagination } from 'src/core/helpers/pagination.helper';
import { User } from 'src/models/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    findAll = async (
        optinos?: {
            keyword?: string,
            fields?: string,
            sort?: string,

        },
        paginationOptions?: {
            limit?: number,
            page?: number,
        }

    ) => {
        const { keyword, fields, sort } = optinos || {};

        const query = this.userModel.find();

        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            query.or([{ name: reg }, { email: reg }, { phone: reg }]);
        }

        if (fields) query.select(fields.trim());

        if (sort) query.sort(sort.trim());

        const { generate, limit, skip } = new Pagination(
            this.userModel,
            { ...paginationOptions, filter: query.getFilter() }
        ).getOptions();

        return await generate(await query.limit(limit).skip(skip));
    }


    updateUser = async (id: Types.ObjectId, updates?: {
        name?: string,
        email?: string,
        password?: {
            old: string,
            new: string,
        },
        phone?: string,
        isVerified?: boolean,
    }) => {
        const { name, email, password, phone, isVerified } = updates || {};
        const { old: oldPassword, new: newPassword } = password || {};


        const user = await this.findUser(id, { oldPassword });

        if (email && email !== user.email) {
            await this.checkExist({ email });
            user.email = email;
        }

        if (phone && phone !== user.phone) {
            await this.checkExist({ phone });
            user.phone = phone;
        }

        if (name && name !== user.name) user.name = name;

        if (newPassword && oldPassword && newPassword !== oldPassword) {
            user.password = await CryptHelper.hash(newPassword);
        }

        if (isVerified !== undefined) user.isVerified = isVerified;

        if (user.isModified()) return await user.save();
    }

    findUser = async (id: Types.ObjectId, options?: {
        oldPassword?: string
    }) => {
        const { oldPassword } = options || {};

        const filter: FilterQuery<User> = { _id: id };

        if (oldPassword) filter.password = await CryptHelper.hash(oldPassword);

        const query = this.userModel.findOne(filter)

        const user = await (oldPassword ? query.select('+password') : query).exec();
        if (!user) throw new HttpException(
            oldPassword ? 'Invalid password' : 'User not found'
            , 404);

        return user;
    }

    deleteUser = async (id: Types.ObjectId) =>
        await this.userModel.findByIdAndDelete(id);


    private async checkExist(options: {
        email?: string,
        phone?: string,
    }) {
        const { email, phone } = options;

        const user = await this.userModel.findOne({ $or: [{ email }, { phone }] });

        if (user) {
            if (user.email === email) throw new HttpException('This email is already in use', 409);
            if (user.phone === phone) throw new HttpException('This phone is already in use', 409);
        }
    }
}
