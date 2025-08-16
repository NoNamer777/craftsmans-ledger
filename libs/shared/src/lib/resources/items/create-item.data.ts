import { Expose } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateItemData {
    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public name: string;

    @IsDecimal({ force_decimal: false, decimal_digits: '0,2' })
    @Expose()
    public weight: number;

    @IsDecimal({ force_decimal: false, decimal_digits: '0,2' })
    @Expose()
    public cost: number;
}
