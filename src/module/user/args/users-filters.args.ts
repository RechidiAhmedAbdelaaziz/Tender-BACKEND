import { FilterArgs } from "src/core/shared/args/pagination.arg";

export interface UsersFilterArgs  extends FilterArgs {
    role?: string;
    accountType?: string;
}