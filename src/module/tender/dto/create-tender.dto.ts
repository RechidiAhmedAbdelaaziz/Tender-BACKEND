import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsMongoId, IsOptional, IsString, Validate, ValidateNested } from "class-validator";


class SourceDTO {
    /**
     * News paper ID
     * @example "Source Name"
     */
    @IsMongoId()
    newsPaper: string;

    /**
     * Images of the source
     */
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: true })
    images: Express.Multer.File[];
}

export class CreateTenderBody {
    /**
     * Title of the tender
     * @example "Tender Title"
     */
    @IsString()
    title: string;

    /**
     * Announcer of the tender
     * @example "Announcer ID"
     */
    @IsMongoId()
    announcer: string;

    /**
     * Category of the tender
     * @example "Category ID"
     */
    @IsMongoId()
    category: string;

    /**
     * Market type of the tender
     * @example "Market Type ID"
     */
    @IsMongoId()
    marketType: string;

    /**
     * Deadline of the tender (ISO 8601)
     * @example 2024-12-17T22:11:42.153+00:00
     */
    @IsDateString()
    deadline: string;

    /**
     * Sources of the tender
     */
    @ValidateNested({ each: true })
    @Type(() => SourceDTO)
    sources: SourceDTO[];

    /**
     * is the tender a startup tender
     */
    @IsOptional()
    @IsBoolean()
    isStartup?: boolean;

}


