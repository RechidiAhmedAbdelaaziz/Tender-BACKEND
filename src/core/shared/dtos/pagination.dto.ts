import { IsInt, IsOptional, Min } from "class-validator";
import { FindQueryDto } from "./find.dto";

export class PaginationQueryDto extends FindQueryDto {
    /**
     * The page number
     * @example 1
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    /**
     * The number of items per page
     * @example 10
     */
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 10;

}
