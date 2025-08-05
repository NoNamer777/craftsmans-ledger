import { Resource, TechnologyTree, TechnologyTreeBuilder } from '@craftsmans-ledger/shared-ui';
import { Expose } from 'class-transformer';
import { nanoid } from 'nanoid';

export class Recipe implements Resource {
    @Expose()
    public id: string;

    @Expose()
    public craftingTime: number;

    @Expose()
    public technologyTree: TechnologyTree;

    @Expose()
    public technologyPoints: number;

    public label() {
        return this.id;
    }

    public compareTo(other: unknown) {
        if (this === other) return true;
        if (!this.isRecipe(other)) return false;

        return (
            this.craftingTime === other.craftingTime &&
            this.technologyPoints === other.technologyPoints &&
            ((this.technologyTree === null && other.technologyTree === null) ||
                this.technologyTree.compareTo(other.technologyTree))
        );
    }

    public isRecipe(value: unknown): value is Recipe {
        return value instanceof Recipe;
    }

    public toCreateRecipeData() {
        const data = new CreateRecipeData();

        data.craftingTime = this.craftingTime;
        data.technologyTreeId = this.technologyTree.id;
        data.technologyPoints = this.technologyPoints;
        return data;
    }

    public toUpdateRecipeData() {
        const data = new UpdateRecipeData();

        data.id = this.id;
        data.craftingTime = this.craftingTime;
        data.technologyTreeId = this.technologyTree.id;
        data.technologyPoints = this.technologyPoints;
        return data;
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

export class RecipeBuilder {
    private recipe = new Recipe();

    public build() {
        return this.recipe;
    }

    public constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('craftingTime' in value && typeof value.craftingTime === 'number')
            this.recipe.craftingTime = value.craftingTime;
        if ('technologyPoints' in value && typeof value.technologyPoints === 'number')
            this.recipe.technologyPoints = value.technologyPoints;
        if ('technologyTreeId' in value && typeof value.technologyTreeId === 'string')
            this.recipe.technologyTree = new TechnologyTreeBuilder().withId(value.technologyTreeId).build();
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
