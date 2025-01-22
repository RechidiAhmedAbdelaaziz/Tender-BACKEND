import { IsDate, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { PaginationQuery } from "src/core/shared/dtos/pagination.dto";


export class TenderResultFilterQuery extends PaginationQuery {
    /**
     * filter by published date after
     * @example '2021-09-01 00:00:00'
     */
    @IsOptional()
    @IsDate()
    publishedAfter?: Date;

    /**
     * filter by region
     * @example 'region'
     */
    @IsOptional()
    @IsString()
    region?: string;

    /**
     * filter by tender
     * @example 'tenderId'
     */
    @IsOptional()
    @IsMongoId()
    tender?: Types.ObjectId;

    /**
     * filter by type
     * @example 'type'
     */
    @IsOptional()
    @IsString()
    type?: string;


}