import { IsString, IsMongoId } from "class-validator";

export class CreateResultBody {

    /**
     * Title of the result
     */
    @IsString()
    title: string;

    /**
     * Announcer of the result
     */
    @IsMongoId()
    announcer: string;

    /**
     * Type of the result
     */
    @IsString()
    type: string;

    /**
     * Tender of the result
     */
    @IsMongoId()
    tender: string;

    /**
     * Sources of the result
     */
    @IsMongoId({ each: true })
    newsPapers: string[];
}