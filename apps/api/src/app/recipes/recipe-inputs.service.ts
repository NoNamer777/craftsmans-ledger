import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeInputsRepository } from './recipe-inputs.repository';
import { RecipesService } from './recipes.service';

@Injectable()
export class RecipeInputsService {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly recipeInputsRepository: RecipeInputsRepository
    ) {}

    public async getAllOfRecipe(recipeId: string) {
        const recipe = await this.recipesService.getById(recipeId);

        if (!recipe) {
            throw new NotFoundException(
                `Could not get Inputs for Recipe with ID "${recipeId}". - Reason: Recipe was not found`
            );
        }
        return await this.recipeInputsRepository.findAllByRecipe(recipeId);
    }
}
