import { Types } from "mongoose";

export interface TenderResultFilterArgs {
    publishedAfter?: Date;
    region?: string;
    type?: string;
    tender?: Types.ObjectId;
}
