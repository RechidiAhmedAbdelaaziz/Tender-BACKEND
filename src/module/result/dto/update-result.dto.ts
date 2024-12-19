import { PartialType } from "@nestjs/swagger";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";
import { CreateResultBody } from "./create-result.dto";

export class UpdateResultParams extends IdParamDto {}

export class UpdateResultBody extends PartialType(CreateResultBody) { }

