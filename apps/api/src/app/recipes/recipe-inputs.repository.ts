import { RecipeItem, serializeAll } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';
import { selectedRecipeItemAttributes } from './models';

@Injectable()
export class RecipeInputsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAllByRecipe(recipeId: string) {
        const results = await this.databaseService.recipeInput.findMany({
            where: { recipeId: recipeId },
            ...selectedRecipeItemAttributes,
        });
        return serializeAll(RecipeItem, results);
    }
}
