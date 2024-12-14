import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { AbstractSchema } from "./abstract-schema";



@KScheam({
    timestamps: true,
})
export class User extends AbstractSchema {
    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    role: UserRoles;
}