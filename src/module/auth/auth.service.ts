import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptHelper } from 'src/core/helpers/crypt.helper';
import { AuthToken } from 'src/core/types/auth-token';
import { JwtPayload } from 'src/core/types/jwt-payload';
import { RefreshToken, RestPasswordOtp } from 'src/models/auth.entity';
import { User } from 'src/models/user.entity';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(RestPasswordOtp.name) private restPasswordOtpModel: Model<RestPasswordOtp>,
        private jwtService: JwtService

    ) { }

    register = async (
        data: { email: string, phone: string, password?: string, name: string },
    ) => {

        const { email, phone, password: nonHashedPass, name } = data;

        const isLoginExist = await this.userModel
            .exists({ $or: [{ email }, { phone }] });

        if (isLoginExist) {
            throw new HttpException('This email or phone number is already registered', 400);
        }

        const password = nonHashedPass ? await CryptHelper.hash(nonHashedPass) : undefined;

        const user = await this.userModel.create({ email, phone, password, name });

        return this.generateToken(user);
    }

    login = async (data: {
        login: string,
        password?: string
    },
        options?: {
            withoutPassword?: boolean
        }
    ) => {
        const { login, password } = data;
        const { withoutPassword } = options || {};

        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        }).select('password');

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const isPasswordMatch = await CryptHelper.compare(password, user.password);
        console.log(await CryptHelper.hash(password) + ' || ' + user.password);

        if (withoutPassword || isPasswordMatch) return this.generateToken(user);

        throw new HttpException('Password is incorrect', 400);


    }

    refreshToken = async (refreshToken: string) => {
        const token = await this.refreshTokenModel.
            findOne({ token: refreshToken, expires: { $gte: new Date() } })
            .populate({
                path: 'user',
                select: '_id'
            });

        if (!token) {
            throw new HttpException('Invalid refresh token', 400);
        }

        return this.generateToken(token.user);

    }

    forgotPassword = async (login: string) => {
        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        });

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const otp = await this.generateRestPasswordOtp(user);

        //TODO: Send OTP to user email or phone number
    }

    resetPassword = async (login: string, otp: number, password: string) => {
        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        }).select('password');

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const token = await this.verifyRestPasswordOtp(user, otp);



        user.password = await CryptHelper.hash(password);
        await Promise.all([user.save(), token.deleteOne()]);

        return this.generateToken(user);
    }




    private async generateToken(user: User): Promise<AuthToken> {
        const payload: JwtPayload = { id: user._id }

        const accessToken = this.jwtService.sign(payload)
        const refreshToken = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        await this.refreshTokenModel.create(
            { token: refreshToken, expires, user },
        )

        return { accessToken, refreshToken }
    }

    private async generateRestPasswordOtp(user: User): Promise<number> {
        const otp = Math.floor(100000 + Math.random() * 900000)

        const expires = new Date(Date.now() + 1000 * 60 * 5)

        await this.restPasswordOtpModel.create(
            { otp, expires, user },
        )

        return otp
    }

    async verifyRestPasswordOtp(user: User | string, otp: number) {
        if (typeof user === 'string') {
            user = await this.userModel.findOne({
                $or: [{ email: user }, { phone: user }]
            }).select('_id');
        }

        const token = await this.restPasswordOtpModel.
            findOne({ otp, user, expires: { $gte: new Date() } })

        if (!token)
            throw new HttpException('Invalid code', 400)

        return token
    }









}


