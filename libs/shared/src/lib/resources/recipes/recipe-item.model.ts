import { Expose, Type } from 'class-transformer';
import { Item } from '../items';
import { RecipeItemDto } from './recipe-item.dto';

export class RecipeItem {
    @Expose()
    @Type(() => Item)
    public item: Item;

    @Expose()
    @Type(() => Number)
    public quantity: number;

    public toDto() {
        const dto = new RecipeItemDto();

        dto.itemId = this.item.id;
        dto.quantity = this.quantity;
        return dto;
    }
}
