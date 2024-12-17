import { IsMongoId } from "class-validator";
import { Types } from "mongoose";


export class UserIdParamDto {
    /**
     * The user id
     * @example '5f4e8d4e1e6b8c0021b8e4f7'
     */
    @IsMongoId()
    userId: string;
}