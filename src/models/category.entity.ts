import { Schema as KSchema, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "./abstract-schema";
import { Schema } from "mongoose";
import { SubCategory } from "./sub-category.dto";

@KSchema()
export class Category extends AbstractSchema {
    @Prop()
    name: string;

   
}

