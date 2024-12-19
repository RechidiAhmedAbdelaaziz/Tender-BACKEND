import { IsDate, IsMongoId, IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "src/core/shared/dtos/pagination.dto";

export class ListResultQuery extends PaginationQueryDto {
    /**
     * Announcer of the result
     */
    @IsOptional()
    @IsMongoId()
    announcer?: string;

    /**
     * Type of the result
     */
    @IsOptional()
    @IsString()
    type?: string;

    /**
     * Tender of the result
     */
    @IsOptional()
    @IsMongoId()
    tender?: string;

    /**
     * Select results with greater than or equal to this date
     */
    @IsOptional()
    @IsDate()
    publishedAt?: Date;


}