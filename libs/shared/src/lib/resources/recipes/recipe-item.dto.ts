import { Expose } from 'class-transformer';
import { Comparable } from '../comparable.model';

export class RecipeItemDto implements Comparable {
    @Expose()
    public itemId: string;

    @Expose()
    public quantity: number;

    public compareTo(other: unknown) {
        if (!other || !(other instanceof RecipeItemDto)) return false;
        if (this === other) return true;

        return this.itemId === other.itemId && this.quantity === other.quantity;
    }
}
