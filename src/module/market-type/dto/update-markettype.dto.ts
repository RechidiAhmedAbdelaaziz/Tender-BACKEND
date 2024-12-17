import { PartialType } from "@nestjs/swagger";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";
import { CreateMarketTypeBodyDto } from "./create-markettype.dto";

export class UpdateMarketTypeParamsDto extends IdParamDto { }

export class UpdateMarketTypeBodyDto extends PartialType(CreateMarketTypeBodyDto) { }