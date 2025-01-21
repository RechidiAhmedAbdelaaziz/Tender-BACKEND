import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";
import { UserRoles } from "../core/enums/user-roles.enum";
import { AccountTypes } from "src/core/enums/account-types.enum";



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

    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    industries?: string[];

    @Prop({ default: AccountTypes.freeTrial })
    accountType: AccountTypes
}