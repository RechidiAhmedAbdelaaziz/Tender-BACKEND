import { AccountTypes } from "src/core/enums/account-types.enum";
import { UserRoles } from "src/core/enums/user-roles.enum";

export interface UpdateUserArgs {
    name?: string;
    expiryDate?: Date;
    email?: string;
    phone?: string;
    industries?: string[];
    notificationSettings?: {
        regions: string[];
    };
    accountType?: AccountTypes;
    role?: UserRoles;
    password?: {
        old: string;
        new: string;
    };

}

