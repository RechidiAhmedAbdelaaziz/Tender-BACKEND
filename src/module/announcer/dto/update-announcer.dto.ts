import { PartialType } from "@nestjs/swagger";
import { CreateAnnouncerBodyDTO } from "./create-announcer.dto";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";

export class UpdateAnnouncerParamsDTO extends IdParamDto { }
export class UpdateAnnouncerBodyDTO extends PartialType(CreateAnnouncerBodyDTO) {
}