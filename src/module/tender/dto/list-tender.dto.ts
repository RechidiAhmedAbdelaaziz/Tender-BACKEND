import { IsBoolean, IsMongoId, IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/core/shared/dtos/pagination.dto";

export class ListTenderQuery extends PaginationQueryDto {

    /**
     * Select specific category
     */
    @IsOptional()
    @IsMongoId()
    category?: string;

    /**
     * Select specific market type
     */
    @IsOptional()
    @IsMongoId()
    marketType?: string;

    /**
     * Select specific announcer
     */
    @IsOptional()
    @IsMongoId()
    announcer?: string;

    /**
     * Select tenders with greater than or equal to this date
     */
    @IsOptional()
    publishedAt?: Date;

    /**
     * Select startup tenders
     */
    @IsOptional()
    @IsBoolean()
    startup?: boolean;
}