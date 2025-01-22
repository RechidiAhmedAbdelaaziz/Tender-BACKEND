import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateTenderBody } from "./create-tender.dto";
import { IsMongoId, IsOptional, IsUrl, ValidateNested } from "class-validator";
import { Types } from "mongoose";
import { Type } from "class-transformer";

class SourceDTO {
    /**
     * The news paper id
     * @example 'News paper id'
     */
    @IsMongoId()
    newsPaper: Types.ObjectId;

    /**
     * The images to add to the news paper
     * @example ['image1', 'image2']
     */
    @IsOptional()
    @IsUrl({}, { each: true })
    imagesToAdd?: string[];

    /**
     * The images to remove from the news paper
     * @example ['image1', 'image2']
     */
    @IsOptional()
    @IsUrl({}, { each: true })
    imagesToRemove?: string[];
}

export class UpdateTenderBody extends PartialType(OmitType(CreateTenderBody, ['sources'] as const)) {

    /**
     * The sources of the tender
     */
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SourceDTO)
    sources?: SourceDTO[];

}