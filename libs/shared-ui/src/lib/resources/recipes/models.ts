import {
    Comparable,
    Item,
    ItemBuilder,
    Resource,
    TechnologyTree,
    TechnologyTreeBuilder,
    transform,
} from '@craftsmans-ledger/shared-ui';
import { Expose, Type } from 'class-transformer';
import { nanoid } from 'nanoid';

export class RecipeItem {
    @Expose()
    @Type(() => Item)
    public item: Item;

    @Expose()
    public quantity: number;

    public toDto() {
        const dto = new RecipeItemDto();

        dto.itemId = this.item.id;
        dto.quantity = this.quantity;
        return dto;
    }
}

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

export class Recipe implements Resource {
    @Expose()
    public id: string;

    @Expose()
    public craftingTime: number;

    @Expose()
    @Type(() => TechnologyTree)
    public technologyTree: TechnologyTree;

    @Expose()
    public technologyPoints: number;

    @Expose()
    @Type(() => RecipeItem)
    public inputs: RecipeItem[] = [];

    @Expose()
    @Type(() => RecipeItem)
    public outputs: RecipeItem[] = [];

    public label() {
        return this.outputs?.map(({ item }) => item.name)?.join(', ') ?? this.id;
    }

    public toDto() {
        const dto = new RecipeDto();

        dto.id = this.id;
        dto.craftingTime = this.craftingTime;
        dto.technologyTreeId = this.technologyTree.id;
        dto.technologyPoints = this.technologyPoints;
        dto.inputs = (this.inputs ?? []).map((input) => input.toDto());
        dto.outputs = (this.outputs ?? []).map((output) => output.toDto());
        return dto;
    }
}

export class CreateRecipeData {
    @Expose()
    public craftingTime: number;

    @Expose()
    public technologyTreeId: string;

    @Expose()
    public technologyPoints: number;
}

export class UpdateRecipeData extends CreateRecipeData {
    @Expose()
    public id: string;
}

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

export class RecipeBuilder {
    private recipe = new Recipe();

    public build() {
        return this.recipe;
    }

    public constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('craftingTime' in value && typeof value.craftingTime === 'number') {
            this.recipe.craftingTime = value.craftingTime;
        }
        if ('technologyPoints' in value && typeof value.technologyPoints === 'number') {
            this.recipe.technologyPoints = value.technologyPoints;
        }
        if ('technologyTreeId' in value && typeof value.technologyTreeId === 'string') {
            this.recipe.technologyTree = new TechnologyTreeBuilder().withId(value.technologyTreeId).build();
        }
        if ('inputs' in value && Array.isArray(value.inputs)) {
            this.recipe.inputs = [];

            for (const input of value.inputs) {
                if (typeof input !== 'object') continue;
                this.recipe.inputs = [...this.recipe.inputs, new RecipeItemBuilder(input).build()];
            }
        }
        if ('outputs' in value && Array.isArray(value.outputs)) {
            this.recipe.outputs = [];

            for (const output of value.outputs) {
                if (typeof output !== 'object') continue;
                this.recipe.outputs = [...this.recipe.outputs, new RecipeItemBuilder(output).build()];
            }
        }
    }

    public withId(recipeId?: string) {
        this.recipe.id = recipeId ?? nanoid();
        return this;
    }

    public withCraftingTime(craftingTime: number) {
        this.recipe.craftingTime = craftingTime;
        return this;
    }

    public withTechnologyTree(technologyTree: TechnologyTree) {
        this.recipe.technologyTree = technologyTree;
        return this;
    }

    public withTechnologyPoints(technologyPoints: number) {
        this.recipe.technologyPoints = technologyPoints;
        return this;
    }
}

export const SortableRecipeAttributes = {
    NAME: 'name',
    CRAFTING_TIME: 'craftingTime',
    TECHNOLOGY_TREE: 'technologyTree',
    TECHNOLOGY_POINTS: 'technologyPoints',
} as const;

export type SortableRecipeAttribute = (typeof SortableRecipeAttributes)[keyof typeof SortableRecipeAttributes];

export const DEFAULT_RECIPE_SORTING_ATTRIBUTE = SortableRecipeAttributes.NAME;
