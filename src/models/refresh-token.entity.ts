

import { Schema as DSchema, Prop } from "@nestjs/mongoose";
import { Schema } from "mongoose";
import { AbstractSchema } from "./abstract-schema";
import { User } from "./user.entity";



@DSchema()
export class RefreshToken extends AbstractSchema {

    @Prop({ type: Schema.Types.ObjectId, ref: User.name })
    user: User

    @Prop()
    token: string

    @Prop({ type: Date, index: { expireAfterSeconds: 2 } })
    expires: Date
}


