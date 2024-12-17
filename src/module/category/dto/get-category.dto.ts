import { IsMongoId, IsOptional } from "class-validator";

export class ListSubCategoryQueryDTO {
    /**
     * Category Id
     * @example '5f2b4e3f6f3e1b2b3b3b'
     */
    @IsOptional()
    @IsMongoId()
    categoryId?: string;
}