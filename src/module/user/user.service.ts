import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CryptHelper } from 'src/core/helpers/crypt.helper';
import { MongoRepository } from 'src/core/helpers/mongo.helper';
import { FilterArgs, PaginationArg } from 'src/core/shared/args/pagination.arg';
import { User } from 'src/models/user.entity';
import { UsersFilterArgs } from './args/users-filters.args';
import { UpdateUserArgs } from './args/update-user.args';

@Injectable()
export class UserService {
    private userRepo: MongoRepository<User>;
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        this.userRepo = new MongoRepository(this.userModel);
    }

    findAll = async (
        filters: UsersFilterArgs,
        paginationArg?: PaginationArg,

    ) => {

        const { keyword, fields, sort, accountType, role } = filters;

        const filter: FilterQuery<User> = {};

        if (accountType) filter.accountType = accountType;
        if (role) filter.role = role;
        if (keyword) filter.name = { $regex: keyword, $options: 'i' };



        const result = await this.userRepo.findWithPagination(
            {
                filter,
                options: { sort: { [sort || 'createdAt']: -1 }, fields },

            },
            paginationArg,
        );

        return result;
    }


    updateUser = async (id: Types.ObjectId, updates?: UpdateUserArgs) => {
        const { name, email, accountType, expiryDate, industries, notificationSettings, phone, role, password } = updates || {};
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

        // if (isVerified !== undefined) user.isVerified = isVerified;

        if (accountType && accountType !== user.accountType) user.accountType = accountType;

        if (expiryDate && expiryDate !== user.expiryDate) user.expiryDate = expiryDate;

        if (industries && industries !== user.industries) user.industries = industries;

        if (notificationSettings && notificationSettings !== user.notificationSettings) user.notificationSettings = notificationSettings;

        if (role && role !== user.role) user.role = role;

        if (user.isModified()) return await user.save();
        return user;
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
