import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateItemData {
    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public name: string;

    @Min(0)
    @IsNumber()
    @Expose()
    public weight: number;

    @Min(0)
    @IsNumber()
    @Expose()
    public cost: number;
}
