import { Types } from "mongoose";

export interface TenderFilterArgs {
    announcer?: Types.ObjectId;
    publishedAfter?: Date;
    closingBefore?: Date;
    marketType?: string;
    industries?: string[];
    isStartup?: boolean;
    regions?: string[];
}