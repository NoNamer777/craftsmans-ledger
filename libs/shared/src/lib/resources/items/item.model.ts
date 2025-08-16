import { Expose } from 'class-transformer';
import { Comparable } from '../comparable.model';
import { Recipe } from '../recipes';
import { Resource } from '../resource.model';

export class Item implements Resource, Comparable {
    @Expose()
    public id: string;

    @Expose()
    public name: string;

    @Expose()
    public weight: number;

    @Expose()
    public cost: number;

    public label() {
        return this.name;
    }

    public hasRecipe(recipes: Recipe[]) {
        return recipes.some((recipe) => recipe.outputs.some((output) => output.item.id === this.id));
    }

    public compareTo(other: unknown) {
        if (this === other) return true;
        if (!this.isItem(other)) return false;

        return this.name === other.name && this.weight === other.weight && this.cost === other.cost;
    }

    public isItem(value: unknown): value is Item {
        return value instanceof Item;
    }
}
