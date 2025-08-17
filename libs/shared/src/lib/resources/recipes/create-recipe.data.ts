import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRecipeData {
    @Min(0)
    @IsNumber()
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
