import { Type } from "class-transformer";
import { IsString, IsEmail, IsStrongPassword, ValidateNested, IsOptional, IsPhoneNumber, IsDate, IsEnum } from "class-validator";
import { AccountTypes } from "src/core/enums/account-types.enum";
import { UserRoles } from "src/core/enums/user-roles.enum";

class ChangePasswordDTO {
    /**
     * The new password of the user
     * @example 'Password123@'
     */
    @IsStrongPassword({}, { message: 'Password is too weak' })
    new: string;

    /**
     * The old password of the user
     * @example 'Password123@'
     */
    @IsStrongPassword({}, { message: 'Invalid password' })
    old: string;
}

class UpdateNotificationSettingsDTO {
    /**
     * The regions to add to the user's notification settings
     * @example ['Algiers', 'Oran']
     */
    regions: string[];

    
}

export class UpdateUserBodyDTO {

    /**
     * The name of the user
     * @example 'Ahmed'
     */
    @IsOptional()
    @IsString()
    name?: string;

    /**
     * The email of the user
     * @example 'ahmed@gmail.com'
     */
    @IsOptional()
    @IsEmail()
    email?: string;

    /**
     * The password of the user
        */
    @IsOptional()
    @ValidateNested()
    @Type(() => ChangePasswordDTO)
    password?: ChangePasswordDTO;


    /**
     * The phone number of the user (DZ)
     * @example '0555555555'
     */
    @IsOptional()
    @IsPhoneNumber('DZ')
    phone?: string;

    /**
     * The industries of the user
     * 
     */
    @IsOptional()
    @IsString({ each: true })
    industries?: string[];

    /**
     * The notification settings of the user
     * 
     */
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateNotificationSettingsDTO)
    notificationSettings?: UpdateNotificationSettingsDTO;

    /**
     * The account type of the user
     * 
     */
    @IsOptional()
    @IsEnum(AccountTypes)
    accountType?: AccountTypes;

    /**
     * The role of the user
     * 
     */
    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    @IsDate()
    expiryDate?: Date;

}