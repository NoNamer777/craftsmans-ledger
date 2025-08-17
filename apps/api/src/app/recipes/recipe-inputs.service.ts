import { RecipeItemDto } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../items';
import { RecipeInputsRepository } from './recipe-inputs.repository';
import { RecipesService } from './recipes.service';

@Injectable()
export class RecipeInputsService {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly itemsService: ItemsService,
        private readonly recipeInputsRepository: RecipeInputsRepository
    ) {}

    public async getAllOfRecipe(recipeId: string) {
        await this.verifyRecipeExists(
            recipeId,
            `Could not get Inputs for Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        return await this.recipeInputsRepository.findAllByRecipe(recipeId);
    }

    public async getInputOfRecipe(recipeId: string, itemId: string) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not get input from Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            itemId,
            `Could not get input from Recipe with ID "${recipeId}". - Reason: Item with ID "${itemId}" was not found`
        );
        return recipe.getInput(itemId);
    }

    public async addInputToRecipe(recipeId: string, dto: RecipeItemDto) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not add input to Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            dto.itemId,
            `Could not add input to Recipe with ID "${recipeId}". - Reason: Item with ID "${dto.itemId}" was not found`
        );

        if (recipe.requiresInput(dto.itemId)) {
            throw new BadRequestException(
                `Could not add input to Recipe with ID "${recipeId}". - Reason: Recipe already has input with Item with ID "${dto.itemId}"`
            );
        }
        return await this.recipeInputsRepository.addInputToRecipe(recipeId, dto);
    }

    public async updateInputOfRecipe(recipeId: string, dto: RecipeItemDto) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not update input of Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            dto.itemId,
            `Could not update input of Recipe with ID "${recipeId}". - Reason: Item with ID "${dto.itemId}" was not found`
        );

        if (!recipe.requiresInput(dto.itemId)) {
            throw new BadRequestException(
                `Could not update input of Recipe with ID "${recipeId}". - Reason: Recipe does not require input with Item with ID "${dto.itemId}"`
            );
        }
        return await this.recipeInputsRepository.updateInputOfRecipe(recipeId, dto);
    }

    public async removeInputFromRecipe(recipeId: string, itemId: string) {
        const recipe = await this.verifyRecipeExists(
            recipeId,
            `Could not remove input from Recipe with ID "${recipeId}". - Reason: Recipe was not found`
        );
        await this.verifyItemExists(
            itemId,
            `Could not remove input from Recipe with ID "${recipeId}". - Reason: Item with ID "${itemId}" was not found`
        );

        if (!recipe.requiresInput(itemId)) {
            throw new BadRequestException(
                `Could not remove input from Recipe with ID "${recipeId}". - Reason: Recipe does not require input with Item with ID "${itemId}"`
            );
        }
        await this.recipeInputsRepository.removeInputFromRecipe(recipeId, itemId);
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
