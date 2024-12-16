import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export class RegisterBodyDto {

    /**
     * The name of the user
     * @example 'Ahmed'
     */
    @IsString()
    name: string;

    /**
     * The email of the user
     * @example 'ahmed@gmail.com'
     */
    @IsEmail()
    email: string;

    /**
     * The phone number of the user (DZ)
     * @example '0555555555'
     */
    @IsPhoneNumber('DZ')
    phone: string;

    /**
     * The password of the user 
     * @example 'Password123@'
     */
    @IsStrongPassword()
    password: string;

}