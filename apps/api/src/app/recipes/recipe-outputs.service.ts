import { RecipeItemDto } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../items';
import { RecipeOutputsRepository } from './recipe-outputs.repository';
import { RecipesService } from './recipes.service';

@Injectable()
export class RecipeOutputsService {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly itemsService: ItemsService,
        private readonly recipeOutputsRepository: RecipeOutputsRepository
    ) {}

    public async getAllOfRecipe(recipeId: string) {
        await this.verifyRecipeExists(
            recipeId,
            `Could not get Outputs for Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        return await this.recipeOutputsRepository.findAllByRecipe(recipeId);
    }

    public async getOutputOfRecipe(recipeId: string, itemId: string) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not get output from Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            itemId,
            `Could not get output from Recipe with ID "${recipeId}". - Reason: Item with ID "${itemId}" was not found`
        );
        return recipe.getOutput(itemId);
    }

    public async addOutputToRecipe(recipeId: string, dto: RecipeItemDto) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not add output to Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            dto.itemId,
            `Could not add output to Recipe with ID "${recipeId}". - Reason: Item with ID "${dto.itemId}" was not found`
        );

        if (recipe.requiresOutput(dto.itemId)) {
            throw new BadRequestException(
                `Could not add output to Recipe with ID "${recipeId}". - Reason: Recipe already has output with Item with ID "${dto.itemId}"`
            );
        }
        return await this.recipeOutputsRepository.addOutputToRecipe(recipeId, dto);
    }

    public async updateOutputOfRecipe(recipeId: string, dto: RecipeItemDto) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not update output of Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            dto.itemId,
            `Could not update output of Recipe with ID "${recipeId}". - Reason: Item with ID "${dto.itemId}" was not found`
        );

        if (!recipe.requiresOutput(dto.itemId)) {
            throw new BadRequestException(
                `Could not update output of Recipe with ID "${recipeId}". - Reason: Recipe does not require output with Item with ID "${dto.itemId}"`
            );
        }
        return await this.recipeOutputsRepository.updateOutputOfRecipe(recipeId, dto);
    }

    public async removeOutputFromRecipe(recipeId: string, itemId: string) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not remove output from Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            itemId,
            `Could not remove output from Recipe with ID "${recipeId}". - Reason: Item with ID "${itemId}" was not found`
        );

        if (!recipe.requiresOutput(itemId)) {
            throw new BadRequestException(
                `Could not remove output from Recipe with ID "${recipeId}". - Reason: Recipe does not require output with Item with ID "${itemId}"`
            );
        }
        await this.recipeOutputsRepository.removeOutputFromRecipe(recipeId, itemId);
    }

    private async verifyRecipeExists(recipeId: string, errorMessage: string) {
        const recipe = await this.recipesService.getById(recipeId);

        if (!recipe) throw new NotFoundException(errorMessage);
        return recipe;
    }

    private async verifyItemExists(itemId: string, errorMessage: string) {
        const item = await this.itemsService.getById(itemId);

        if (!item) throw new NotFoundException(errorMessage);
        return item;
    }
}
