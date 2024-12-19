import { PartialType } from "@nestjs/swagger";
import { Types } from "mongoose";

export class AuctionParams {
    title: string;
    type: string;
    deadline: Date;
    sources: {
        images: Express.Multer.File[];
        newsPaper: Types.ObjectId;
    }[];
}

export class OptionalAuctionParams extends PartialType(AuctionParams) {

}