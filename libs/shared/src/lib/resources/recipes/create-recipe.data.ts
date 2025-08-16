import { Expose } from 'class-transformer';
import { IsDecimal, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRecipeData {
    @IsDecimal({ decimal_digits: '0,2' })
    @Expose()
    public craftingTime: number;

    @IsNotEmpty()
    @IsString()
    @Expose()
    public technologyTreeId: string;

    @Min(0)
    @IsInt()
    @Expose()
    public technologyPoints: number;
}
