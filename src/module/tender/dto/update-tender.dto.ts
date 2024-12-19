import { PartialType } from "@nestjs/swagger";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";
import { CreateTenderBody } from "./create-tender.dto";

export class UpdateTenderParams extends IdParamDto{}

export class UpdateTenderBody extends PartialType(CreateTenderBody){}