import { IsMongoId, IsString } from "class-validator";


export class CreateCategoryBodyDTO {
    /**
     * Category name
     * @example 'Electronics'
     */
    @IsString()
    name: string;
}

export class CreateSubCategoryBodyDTO {
    /**
     * Sub-category name
     * @example 'Mobiles'
     */
    @IsString()
    name: string;

    /**
     * Category Id
     * @example '5f2b4e3f6f3e1b2b3b3b'
     */
    @IsMongoId()
    categoryId: string;
}