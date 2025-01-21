import { IsMongoId } from "class-validator";

export class IdParams {
    /**
     * ID of the entity
     * @example 1
     */
    @IsMongoId()
    id: string;
}