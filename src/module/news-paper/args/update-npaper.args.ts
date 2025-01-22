import { CreateNewsPaperArgs } from "./create-npaper.args";
import { IdArg } from "src/core/shared/args/id.arg";

export interface UpdateNewsPaperArgs extends Partial<CreateNewsPaperArgs>, IdArg { }