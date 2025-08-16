import { Expose, Type } from 'class-transformer';
import { transform } from '../../utils';
import { Comparable } from '../comparable.model';
import { Resource } from '../resource.model';
import { CreateRecipeData } from './create-recipe.data';
import { RecipeItemDto } from './recipe-item.dto';
import { UpdateRecipeData } from './update-recipe.data';

export class RecipeDto implements Resource, Comparable {
    @Expose()
    public id: string;

    @Expose()
    public craftingTime: number;

    @Expose()
    public technologyTreeId: string;

    @Expose()
    public technologyPoints: number;

    @Expose()
    @Type(() => RecipeItemDto)
    public inputs: RecipeItemDto[];

    @Expose()
    @Type(() => RecipeItemDto)
    public outputs: RecipeItemDto[];

    public label() {
        return this.outputs.map(({ itemId }) => itemId).join(', ');
    }

    public toUpdateRecipeData() {
        return transform(UpdateRecipeData, this);
    }

    public toCreateRecipeData() {
        return transform(CreateRecipeData, this);
    }

    public compareTo(other: unknown) {
        if (!(other instanceof RecipeDto) || !other) return false;
        if (this === other) return true;

        return (
            this.id === other.id &&
            this.craftingTime === other.craftingTime &&
            this.technologyTreeId === other.technologyTreeId &&
            this.technologyPoints === other.technologyPoints &&
            this.compareRecipeItemDtos(this.inputs, other.inputs) &&
            this.compareRecipeItemDtos(this.outputs, other.outputs)
        );
    }

    private compareRecipeItemDtos(thisRecipeItems: RecipeItemDto[], otherRecipeItems: RecipeItemDto[]) {
        if (thisRecipeItems.length !== otherRecipeItems.length) return false;

        const sortedThis = thisRecipeItems.sort((curr, next) => curr.itemId.localeCompare(next.itemId));
        const sortedOther = otherRecipeItems.sort((curr, next) => curr.itemId.localeCompare(next.itemId));

        for (let idx = 0; idx < sortedThis.length; idx++) {
            const entryThis = sortedThis[idx];
            const entryOther = sortedOther[idx];

            if (!entryThis.compareTo(entryOther)) return false;
        }
        return true;
    }
}
