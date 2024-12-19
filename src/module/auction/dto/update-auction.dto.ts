import { PartialType } from "@nestjs/swagger";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";
import { CreateAuctionBody } from "./create-auction.dto";

export class UpdateAuctionParams extends PartialType(IdParamDto) { }

export class UpdateAuctionBody extends PartialType(CreateAuctionBody) { }