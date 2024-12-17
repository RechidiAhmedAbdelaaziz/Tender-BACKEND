import { IsString } from "class-validator";

export class CreateMarketTypeBodyDto {
    /**
     * Name of the market type
     * @example "Stock"
     */
    @IsString()
    name: string;
}