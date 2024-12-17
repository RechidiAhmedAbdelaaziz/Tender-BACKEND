import { IsMongoId } from "class-validator";

export class IdParamDto {
    /**
     * ID of the entity
     * @example 1
     */
    @IsMongoId()
    id: string;
}