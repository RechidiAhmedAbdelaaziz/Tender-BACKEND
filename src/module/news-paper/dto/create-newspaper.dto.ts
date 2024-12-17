import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateNewspaperDto {
    /**
     * Name of the newspaper
     * @example The New York Times
     */
    @IsString()
    name: string;

    /**
     * Image of the newspaper
     */
    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;

}

