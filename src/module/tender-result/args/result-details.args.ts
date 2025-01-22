import { Types } from "mongoose";

export interface CreateResultArgs {
    title: string;
    publishedDate: Date;
    type: string;
    tender: Types.ObjectId;
    region: string;
    sources: {
        newsPaper: Types.ObjectId;
        images: string[];
    }[]
}

export interface UpdateResultArgs extends Partial<Omit<CreateResultArgs, 'sources'>> {
    sources?: {
        newsPaper: Types.ObjectId;
        imagesToAdd?: string[];
        imagesToRemove?: string[];
    }[]
}