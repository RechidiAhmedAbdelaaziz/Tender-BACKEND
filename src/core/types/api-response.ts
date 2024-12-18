import { User } from "src/models/user.entity";
import { AuthToken } from "./auth-token";

export class ApiResult<T = any> {
    data?: T;
    tokens?: AuthToken;
    message?: string;
    pagination?: { page?: number; length?: number; next?: number; prev?: number };

    private constructor(
        attributes: {
            data?: T,
            tokens?: AuthToken,
            message?: string,
            user?: User,
            pagination?: { page?: number; length?: number; next?: number; prev?: number }
        }
    ) {
        this.data = attributes.data;
        this.tokens = attributes.tokens;
        this.message = attributes.message;
        this.pagination = attributes.pagination;
    }

    static success<T = any>(
        attributes: {
            data?: T,
            tokens?: AuthToken,
            message?: string,
            user?: User,
            pagination?: { page?: number; length?: number; next?: number; prev?: number }
        }

    ) {
        return new ApiResult<T>(attributes);
    }

}