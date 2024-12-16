import { Types } from "mongoose";
import { UserRoles } from "../enums/user-roles.enum";
import { User } from "src/models/user.entity";


export class JwtPayload {
    id: Types.ObjectId;
    role: UserRoles;
    isVerified: boolean;

    constructor(user: User) {
        this.id = user._id;
        this.role = user.role;
        this.isVerified = user.isVerified;
    }

    // toPlainObject for jwt payload
    toPlainObject() {
        return {
            id: this.id,
            role: this.role,
            isVerified: this.isVerified
        }
    }

}