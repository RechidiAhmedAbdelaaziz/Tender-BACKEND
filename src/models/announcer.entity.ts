import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";


@KSchema()
export class Announcer extends AbstractSchema {
    @Prop()
    name: string;

    @Prop()
    about: string;

    @Prop()
    imageUrl: string;
}
