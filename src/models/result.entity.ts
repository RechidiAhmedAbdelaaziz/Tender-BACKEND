import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { Schema } from "mongoose";
import { Announcer } from "./announcer.entity";
import { NewsPaper } from "./news-paper.entity";
import { Tender } from "./tender.entity";


@KSchema({
    timestamps: true
})
export class Result extends AbstractSchema {
    @Prop()
    title: string;

    @Prop({ type: Schema.Types.ObjectId, ref: Announcer.name })
    announcer: Announcer;

    @Prop()
    type : string;

    @Prop()
    deadline: Date;

    @Prop({ type: Schema.Types.ObjectId, ref: Tender.name })
    tender: Tender;

    @Prop({
        type: [{
            imageUrls: [String],
            newsPaper: { type: Schema.Types.ObjectId, ref: NewsPaper.name }
        }],
        default: [],
        _id: false
    })
    sources: {
        imageUrls: string[];
        newsPaper: NewsPaper;
    }[]


}