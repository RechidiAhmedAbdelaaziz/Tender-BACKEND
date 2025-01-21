import { CreateAnnouncerArgs } from "./create-announcer.args";
import { IdArg } from "src/core/shared/args/id.arg";

export interface UpdateAnnouncerArgs extends Partial<CreateAnnouncerArgs>, IdArg { }