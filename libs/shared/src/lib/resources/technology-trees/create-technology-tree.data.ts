import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateTechnologyTreeData {
    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public name: string;

    @Min(0)
    @IsInt()
    @Expose()
    public maxPoints: number;
}
