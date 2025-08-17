import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Resource } from '../resource.model';
import { TechnologyTree } from '../technology-trees';
import { RecipeItem } from './recipe-item.model';
import { RecipeDto } from './recipe.dto';

export class Recipe implements Resource {
    @IsNotEmpty()
    @IsString()
    @Expose()
    public id: string;

    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Expose()
    public craftingTime: number;

    @ValidateNested()
    @Expose()
    @Type(() => TechnologyTree)
    public technologyTree: TechnologyTree;

    @Min(0)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @Expose()
    public technologyPoints: number;

    @ValidateNested({ each: true })
    @Expose()
    @Type(() => RecipeItem)
    public inputs: RecipeItem[] = [];

    @ValidateNested({ each: true })
    @Expose()
    @Type(() => RecipeItem)
    public outputs: RecipeItem[] = [];

    public requiresInput(itemId: string) {
        return this.inputs.some((input) => input.item.id === itemId);
    }

    public requiresOutput(itemId: string) {
        return this.outputs.some((output) => output.item.id === itemId);
    }

    public getInput(itemId: string) {
        return this.inputs.find((input) => input.item.id === itemId);
    }

    public getOutput(itemId: string) {
        return this.outputs.find((output) => output.item.id === itemId);
    }

    public label() {
        return this.outputs?.map(({ item }) => item.name)?.join(', ') ?? this.id;
    }

    public get multipleOutputsLabel() {
        return this.outputs.map(({ item, quantity }) => `${quantity} x ${item.name}`).join(', ');
    }

    public get hasOneOutput() {
        return this.outputs.length === 1;
    }

    public get outputQuantity() {
        return this.outputs[0].quantity;
    }

    public get outputWeight() {
        return this.outputs?.reduce((weight, output) => weight + output.quantity * output.item.weight, 0) ?? 0;
    }

    public inputValue(recipes: Recipe[]) {
        let inputValue = 0;

        for (const input of this.inputs ?? []) {
            if (input.item.hasRecipe(recipes)) {
                const inputRecipe = recipes.find((recipe) => recipe.requiresItemForOutput(input.item.id));
                inputValue += (input.item.cost + inputRecipe.inputValue(recipes)) * input.quantity;
            } else {
                inputValue += input.quantity * input.item.cost;
            }
        }
        return inputValue;
    }

    public get outputValue() {
        return this.outputs?.reduce((value, output) => value + output.quantity * output.item.cost, 0) ?? 0;
    }

    // TODO: Memoize this function to reduce computation load.
    public profit(recipes: Recipe[]) {
        if (!recipes) return 0;
        return this.outputValue - this.inputValue(recipes);
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

    private requiresItemForOutput(itemId: string) {
        return this.outputs.some((output) => output.item.id === itemId);
    }
}
