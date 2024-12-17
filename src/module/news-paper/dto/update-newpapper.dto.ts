import { PartialType } from "@nestjs/swagger";
import { CreateNewspaperDto } from "./create-newspaper.dto";
import { IsMongoId } from "class-validator";


export class UpdateNewspaperParamsDto {
    /**
     * ID of the newspaper
     * @example 1
     */
    @IsMongoId()
    id: string;
}

export class UpdateNewspaperBodyDto extends PartialType(CreateNewspaperDto) { }