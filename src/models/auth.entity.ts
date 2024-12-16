

import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";
import { AbstractSchema } from "./abstract-schema";
import { User } from "./user.entity";


/**
 * Schema for storing refresh token
 */
@DSchema()
export class RefreshToken extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop()
    token: string

    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    expires: Date
}

/**
 * Schema for storing OTP for password reset
 */
@DSchema()
export class RestPasswordOtp extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop()
    otp: number

    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    expires: Date
}


/**
 * Schema for storing OTP for account verification
 */
@DSchema()
export class AccountVerificationOtp extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop()
    otp: number

    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    expires: Date
}