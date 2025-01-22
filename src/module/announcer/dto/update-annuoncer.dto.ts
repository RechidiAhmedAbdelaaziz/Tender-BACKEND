import { PartialType } from "@nestjs/swagger";
import { CreateAnnouncerBody } from "./create-announcer.dto";

export class UpdateAnnouncerBody extends PartialType(CreateAnnouncerBody) { }