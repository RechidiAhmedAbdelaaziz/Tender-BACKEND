import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";

@KSchema()
export class MarketType extends AbstractSchema {
    @Prop()
    name: string;
}