import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class PaymentSessionItemDto {

    @IsString()
    name: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    quantity: number;


}