import { nanoid } from 'nanoid';
import { TechnologyTree, TechnologyTreeBuilder } from '../technology-trees';
import { RecipeItemBuilder } from './recipe-item.builder';
import { Recipe } from './recipe.model';

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
