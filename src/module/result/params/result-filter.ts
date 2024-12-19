import { Types } from "mongoose";

export class ResultFilter {
    announcer?: Types.ObjectId;
    type?: string;
    tender?: Types.ObjectId;
    publishedAt?: Date;
}