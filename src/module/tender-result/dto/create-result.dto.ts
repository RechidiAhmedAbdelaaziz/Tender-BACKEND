import { Type } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsString, IsUrl, ValidateNested } from "class-validator";
import { Types } from "mongoose";


class SourceDTO {
    /**
     * news paper
     * @example 'newsPaperId'
     */
    @IsMongoId()
    newsPaper: Types.ObjectId;

    /**
     * images 
     * @example ['imageURL']
     */
    @IsArray()
    @IsUrl({}, { each: true })
    images: string[];
}

export class CreateResultBody {
    /**
     * published date
     * @example '2021-09-01 00:00:00'
     */
    @IsDate()
    publishedDate: Date;

    /**
     * region
     * @example 'region'
     */
    @IsString()
    region: string;

    /**
     * tender
     * @example 'tenderId'
     */
    @IsMongoId()
    tender: Types.ObjectId;

    /**
     * type
     * @example 'type'
     */
    @IsString()
    type: string;

    /**
     * title
     * @example 'title'
     */
    @IsString()
    title: string;

    /**
     * sources
     * @example [{ newsPaper: 'newsPaperId', images: ['imageId'] }]
     */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SourceDTO)
    sources: SourceDTO[];

}