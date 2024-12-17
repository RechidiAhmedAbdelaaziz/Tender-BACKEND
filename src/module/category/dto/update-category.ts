import { PartialType } from "@nestjs/swagger";
import { IdParamDto } from "src/core/shared/dtos/id-param.dto";
import { CreateCategoryBodyDTO, CreateSubCategoryBodyDTO } from "./create-category.dto";
import e from "express";

export class UpdateCategoryParamsDTO extends IdParamDto { }

export class UpdateCategoryBodyDTO extends PartialType(CreateCategoryBodyDTO) {
}

export class UpdateSubCategoryParamsDTO extends IdParamDto { }

export class UpdateSubCategoryBodyDTO extends PartialType(CreateSubCategoryBodyDTO) {
}