import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { Schema } from "mongoose";
import { Announcer } from "./announcer.entity";
import { Category } from "./category.entity";
import { MarketType } from "./market-type.entity";
import { NewsPaper } from "./news-paper.entity";


@KSchema({
    timestamps: true
})
export class Tender extends AbstractSchema {
    @Prop()
    title: string;

    @Prop({ type: Schema.Types.ObjectId, ref: Announcer.name })
    announcer: Announcer;

    @Prop({ type: Schema.Types.ObjectId, ref: Category.name })
    category: Category;

    @Prop({ type: Schema.Types.ObjectId, ref: MarketType.name })
    marketType: MarketType;

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

    @Prop({ default: false })
    isStartup: boolean;

}