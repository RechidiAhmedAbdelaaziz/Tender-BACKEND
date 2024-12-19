import { PartialType } from "@nestjs/swagger";
import { Types } from "mongoose";

export class ResultParams {
    title: string;
    announcer: Types.ObjectId;
    type: string;
    tender: Types.ObjectId;
    deadline: Date;
    sources: {
        images: Express.Multer.File[];
        newsPaper: Types.ObjectId;
    }[];
}

export class UpdateResultParams extends PartialType(ResultParams) {

}