import { RecipeItem } from './recipe-item.model';
import { Item, ItemBuilder } from '../items';

export class RecipeItemBuilder {
    private readonly recipeItem = new RecipeItem();

    constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('quantity' in value && typeof value.quantity === 'number') this.withQuantity(value.quantity);
        if ('itemId' in value && typeof value.itemId === 'string')
            this.withItem(new ItemBuilder().withId(value.itemId).build());
    }

    public build() {
        return this.recipeItem;
    }

    public withItem(item: Item) {
        this.recipeItem.item = item;
        return this;
    }

    public withQuantity(quantity: number) {
        this.recipeItem.quantity = quantity;
        return this;
    }
}
