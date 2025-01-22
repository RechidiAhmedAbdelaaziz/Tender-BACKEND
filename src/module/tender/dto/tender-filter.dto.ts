import { IsBoolean, IsDate, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { PaginationQuery } from "src/core/shared/dtos/pagination.dto";

export class TenderFilterQuery extends PaginationQuery {
    /**
     * filter by announcer
     * @example 'AnnouncerId'
     */
    @IsOptional()
    @IsMongoId()
    announcer?: Types.ObjectId;

    /**
     * filter by published date after
     * @example '2021-09-01 00:00:00'
     */
    @IsOptional()
    @IsDate()
    publishedAfter?: Date;

    /**
     * filter by closing date before
     * @example '2021-09-01 00:00:00'
     */
    @IsOptional()
    @IsDate()
    closingBefore?: Date;

    /**
     * filter by market type
     * @example 'marketType'
     */
    @IsOptional()
    @IsString()
    marketType?: string;

    /**
     * filter by industries
     * @example ['industry1', 'industry2']
     */
    @IsOptional()
    @IsString({ each: true })
    industries?: string[];

    /**
     * filter by startup
     * @example true
     */
    @IsOptional()
    @IsBoolean()
    isStartup?: boolean;

    /**
     * filter by regions
     * @example ['region1', 'region2']
     */
    @IsOptional()
    @IsString({ each: true })
    regions?: string[];

}

