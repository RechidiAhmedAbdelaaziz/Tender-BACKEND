import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateAnnouncerBodyDTO {
    /**
     * The name of the announcer
     * @example 'Ahmed'
     */
    @IsString()
    name: string;

    /**
     * The about of the announcer
     * @example 'This is a description'
     */
    @IsOptional()
    @IsString()
    about?: string;

    /**
     * The image of the announcer
     */
    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary' })
    image: Express.Multer.File;

}


