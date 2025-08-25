import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Comparable } from '../comparable.model';

export class RecipeItemDto implements Comparable {
    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public itemId: string;

    @Min(0.1)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Expose()
    public quantity: number;

    public compareTo(other: unknown) {
        if (!other || !(other instanceof RecipeItemDto)) return false;
        if (this === other) return true;

        return this.itemId === other.itemId && this.quantity === other.quantity;
    }
}
