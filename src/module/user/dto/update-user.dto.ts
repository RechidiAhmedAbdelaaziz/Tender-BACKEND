import { IsOptional, IsDate, IsEnum } from "class-validator";
import { AccountTypes } from "src/core/enums/account-types.enum";
import { UserRoles } from "src/core/enums/user-roles.enum";



export class UpdateUserBodyDTO {

    @IsOptional()
    @IsEnum(AccountTypes)
    accountType?: AccountTypes;

    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    @IsDate()
    expiryDate?: Date;

}