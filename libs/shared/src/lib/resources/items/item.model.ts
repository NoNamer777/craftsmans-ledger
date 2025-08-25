import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Comparable } from '../comparable.model';
import { Recipe } from '../recipes';
import { Resource } from '../resource.model';

export class Item implements Resource, Comparable {
    @IsNotEmpty()
    @IsString()
    @Expose()
    public id: string;

    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    @Expose()
    public name: string;

    @Min(0)
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
    @Expose()
    public weight: number;

    @Min(0)
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
    @Expose()
    public cost: number;

    @Exclude()
    public profit: number = null;

    public label() {
        return this.name;
    }

    public compareTo(other: unknown) {
        if (this === other) return true;
        if (!this.isItem(other)) return false;

        return this.name === other.name && this.weight === other.weight && this.cost === other.cost;
    }

    public isItem(value: unknown): value is Item {
        return value instanceof Item;
    }

    public hasRecipes(recipes: Recipe[]) {
        return recipes.some((recipe) => recipe.createsItem(this.id));
    }

    public hasOneRecipe(recipes: Recipe[]) {
        return recipes.filter((recipe) => recipe.createsItem(this.id)).length === 1;
    }

    public hasMultipleRecipes(recipes: Recipe[]) {
        return recipes.filter((recipe) => recipe.createsItem(this.id)).length > 1;
    }
}
