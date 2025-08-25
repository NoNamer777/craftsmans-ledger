import { RecipeItemDto } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../items';
import { RecipeOutputsRepository } from '../repositories';
import { RecipesService } from './recipes.service';

@Injectable()
export class RecipeOutputsService {
    private readonly recipesService: RecipesService;
    private readonly itemsService: ItemsService;
    private readonly recipeOutputsRepository: RecipeOutputsRepository;
    private readonly logger = new Logger(RecipeOutputsService.name);

    constructor(
        recipesService: RecipesService,
        itemsService: ItemsService,
        recipeOutputsRepository: RecipeOutputsRepository
    ) {
        this.recipesService = recipesService;
        this.itemsService = itemsService;
        this.recipeOutputsRepository = recipeOutputsRepository;
    }

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

        if (recipe.createsItem(dto.itemId)) {
            const error = new BadRequestException(
                `Could not add output to Recipe with ID "${recipeId}". - Reason: Recipe already has output with Item with ID "${dto.itemId}"`
            );
            this.logger.warn(error.message);

            throw error;
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

        if (!recipe.createsItem(dto.itemId)) {
            const error = new BadRequestException(
                `Could not update output of Recipe with ID "${recipeId}". - Reason: Recipe does not require output with Item with ID "${dto.itemId}"`
            );
            this.logger.warn(error.message);

            throw error;
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

        if (!recipe.createsItem(itemId)) {
            const error = new BadRequestException(
                `Could not remove output from Recipe with ID "${recipeId}". - Reason: Recipe does not require output with Item with ID "${itemId}"`
            );
            this.logger.warn(error.message);

            throw error;
        }
        await this.recipeOutputsRepository.removeOutputFromRecipe(recipeId, itemId);
    }

    private async verifyRecipeExists(recipeId: string, errorMessage: string) {
        const recipe = await this.recipesService.getById(recipeId);

        if (!recipe) {
            const error = new NotFoundException(errorMessage);
            this.logger.warn(error.message);

            throw error;
        }
        return recipe;
    }

    private async verifyItemExists(itemId: string, errorMessage: string) {
        const item = await this.itemsService.getById(itemId);

        if (!item) {
            const error = new NotFoundException(errorMessage);
            this.logger.warn(error.message);

            throw error;
        }
        return item;
    }
}
