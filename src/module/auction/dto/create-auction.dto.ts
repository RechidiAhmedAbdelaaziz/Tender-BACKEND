import { IsDate, IsMongoId, IsString } from "class-validator";

export class CreateAuctionBody {
    /**
     * Title of the auction
     */
    @IsString()
    title: string;

    /**
     * Type of the auction
     */
    @IsString()
    type: string;

    /**
     * Deadline of the auction
     */
    @IsDate()
    deadline: Date;

    /**
     * Sources of the auction
     */
    @IsMongoId({ each: true })
    newsPapers: string[];
}