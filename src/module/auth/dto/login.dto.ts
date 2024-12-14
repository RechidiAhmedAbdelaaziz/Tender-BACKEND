import { IsStrongPassword, Validate } from "class-validator";
import { IsEmailOrPhone } from "src/core/validators/is-email-or-phone";




export class LoginDto {


    /**
     * The login of the user (email or phone number)
     * @example 'ahmed@gmail.com'
     * @example '0555555555'
     */
    @Validate(IsEmailOrPhone)
    login: string;

    /**
     * The password of the user 
     * @example 'Password123@'
     */
    @IsStrongPassword()
    password: string;


}