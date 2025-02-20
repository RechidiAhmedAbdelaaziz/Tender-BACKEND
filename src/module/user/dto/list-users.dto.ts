import { IsEnum, IsOptional } from "class-validator";
import { AccountTypes } from "src/core/enums/account-types.enum";
import { UserRoles } from "src/core/enums/user-roles.enum";
import { PaginationQuery } from "src/core/shared/dtos/pagination.dto";

export class ListUsersDto extends PaginationQuery {
    /**
     * Role of the user
     */
    @IsOptional()
    @IsEnum([UserRoles.ADMIN, UserRoles.USER])
    role?: UserRoles;

    /**
     * Account type of the user
     */
    @IsOptional()
    @IsEnum([AccountTypes.freeTrial, AccountTypes.premium, AccountTypes.expired])
    accountType?: AccountTypes;

}