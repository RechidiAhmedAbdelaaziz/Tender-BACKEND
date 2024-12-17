import { Type } from "class-transformer";
import { IsString, IsEmail, IsStrongPassword, ValidateNested, IsOptional, IsPhoneNumber } from "class-validator";

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

}