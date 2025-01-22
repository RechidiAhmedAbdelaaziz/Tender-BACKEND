import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, MinLength, ValidateNested } from "class-validator";
import { Types } from "mongoose";

class SourceDTO {
    /**
     * The news paper id
     * @example 'News paper id'
     */
    @IsMongoId()
    newsPaper: Types.ObjectId;

    /**
     * The images of the news paper
     * @example ['image1', 'image2']
     */
    @IsUrl({}, { each: true })
    images: string[];
}


export class CreateTenderBody {

    /**
     * The title of the tender
     * @example 'Tender title'
     */
    @IsString()
    @MinLength(5)
    title: string;

    /**
     * The announcer of the tender
     * @example 'Announcer id'
     */
    @IsMongoId()
    announcer: Types.ObjectId;

    /**
     * The published date of the tender
     * @example '2021-01-01T00:00:00.000Z'
     */
    @IsDate()
    publishedDate: Date;

    /**
     * The closing date of the tender
     * @example '2021-01-01T00:00:00.000Z'
     */
    @IsDate()
    closingDate: Date;

    /**
     * The charge price of the tender
     * @example 100
     */
    @IsOptional()
    @IsNumber()
    chargePrice?: number;

    /**
     * The market type of the tender
     * @example 'Market type'
     */
    @IsString()
    marketType: string;

    /**
     * The industry of the tender
     * @example 'Industry'
     */
    @IsString()
    industry: string;

    /**
     * The region of the tender
     * @example 'Region'
     */
    @IsString()
    region: string;

    /**
     * The sources of the tender
     * @example 'Sources'
     */
    @ValidateNested({ each: true })
    @Type(() => SourceDTO)
    sources: SourceDTO[];

}