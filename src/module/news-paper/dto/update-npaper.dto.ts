import { PartialType } from "@nestjs/swagger";
import { CreateNewsPaperBody } from "./create-npaper.dto";

export class UpdateNewsPaperBody extends PartialType(CreateNewsPaperBody) { }