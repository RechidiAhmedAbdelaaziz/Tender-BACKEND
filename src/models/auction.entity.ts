import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { Schema } from "mongoose";
import { NewsPaper } from "./news-paper.entity";


@KSchema({
    timestamps: true
})
export class Auction extends AbstractSchema {
    @Prop()
    title: string;

    @Prop()
    type: string;

    @Prop()
    deadline: Date;

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