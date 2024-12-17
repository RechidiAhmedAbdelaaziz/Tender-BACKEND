import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";

@KSchema()
export class NewsPaper extends AbstractSchema {
    @Prop()
    name: string;

    @Prop()
    imageUrl: string;
}
