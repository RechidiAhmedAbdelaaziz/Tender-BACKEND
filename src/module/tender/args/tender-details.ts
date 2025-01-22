import { Types } from "mongoose";

export interface CreateTenderArg {
    title: string;
    announcer: Types.ObjectId;
    publishedDate: Date;
    closingDate: Date;
    chargePrice?: number;
    marketType: string;
    industry: string;
    region: string;
    sources: {
        newsPaper: Types.ObjectId;
        images: string[];
    }[]
}

export interface UpdateTenderArg extends Partial<Omit<CreateTenderArg, 'sources'>> {
    sources?: {
        newsPaper: Types.ObjectId;
        imagesToAdd?: string[];
        imagesToRemove?: string[];
    }[]
}