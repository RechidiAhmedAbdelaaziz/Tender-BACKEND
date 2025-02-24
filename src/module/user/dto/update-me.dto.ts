import { Type } from "class-transformer";
import { IsString, IsEmail, IsStrongPassword, ValidateNested, IsOptional, IsPhoneNumber, } from "class-validator";

class ChangePasswordDTO {

    @IsStrongPassword({}, { message: 'Password is too weak' })
    new: string;


    @IsStrongPassword({}, { message: 'Invalid password' })
    old: string;
}

class UpdateNotificationSettingsDTO {

    @IsString({ each: true })
    regions: string[];


}

export class UpdateMeBodyDTO {
    @IsOptional()
    @IsString()
    name?: string;


    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @ValidateNested()
    @Type(() => ChangePasswordDTO)
    password?: ChangePasswordDTO;



    @IsOptional()
    @IsPhoneNumber('DZ')
    phone?: string;


    @IsOptional()
    @IsString({ each: true })
    industries?: string[];


    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateNotificationSettingsDTO)
    notificationSettings?: UpdateNotificationSettingsDTO;

}