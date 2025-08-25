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
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Expose()
    public techPoints: number;

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

    public createsItem(itemId: string) {
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

    public toDto() {
        const dto = new RecipeDto();

        dto.id = this.id;
        dto.craftingTime = this.craftingTime;
        dto.technologyTreeId = this.technologyTree.id;
        dto.techPoints = this.techPoints;
        dto.inputs = (this.inputs ?? []).map((input) => input.toDto());
        dto.outputs = (this.outputs ?? []).map((output) => output.toDto());
        return dto;
    }
}
