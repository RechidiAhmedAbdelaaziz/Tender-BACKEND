import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { Schema } from "mongoose";
import { Category } from "./category.entity";

@KSchema()
export class SubCategory extends AbstractSchema {
    @Prop()
    name: string;

    @Prop({ type: Schema.Types.ObjectId, ref: Category.name })
    category: Category;

}