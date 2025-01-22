import { OmitType, PartialType } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsOptional, IsUrl, ValidateNested } from "class-validator";
import { CreateResultBody } from "./create-result.dto";
import { Type } from "class-transformer";
import { Types } from "mongoose";


class SourceDTO {
    /**
     * news paper
     * @example 'newsPaperId'
     */
    @IsMongoId()
    newsPaper: Types.ObjectId;

    /**
     * images  to be added
     * @example ['imageURL']
     */
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    imagesToAdd?: string[];

    /**
     * images to be removed
     * @example ['imageURL']
     */
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    imagesToRemove?: string[];
}

export class UpdateResultBody extends PartialType(OmitType(CreateResultBody, ['sources'] as const)) {
    /**
     * sources
     * @example [{ newsPaper: 'newsPaperId', imagesToAdd: ['imageId'], imagesToRemove: ['imageId'] }]
     */
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SourceDTO)
    sources?: SourceDTO[];

}