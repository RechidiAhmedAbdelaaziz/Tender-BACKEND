import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { UserRoles } from "../core/enums/user-roles.enum";



@KScheam({
    timestamps: true,
})
export class User extends AbstractSchema {
    @Prop()
    name: string;

    @Prop({ select: false })
    password: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop({ select: false, default: UserRoles.USER })
    role: UserRoles;
}