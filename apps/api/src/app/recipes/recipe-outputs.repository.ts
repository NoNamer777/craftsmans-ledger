import { RecipeItem, RecipeItemDto, serialize, serializeAll } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';
import { selectedRecipeItemAttributes } from './models';

@Injectable()
export class RecipeOutputsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAllByRecipe(recipeId: string) {
        const results = await this.databaseService.prismaClient.recipeOutput.findMany({
            where: { recipeId: recipeId },
            ...selectedRecipeItemAttributes,
        });
        return serializeAll(RecipeItem, results);
    }

    public async addOutputToRecipe(recipeId: string, dto: RecipeItemDto) {
        const result = await this.databaseService.prismaClient.recipeOutput.create({
            data: {
                recipeId: recipeId,
                itemId: dto.itemId,
                quantity: dto.quantity,
            },
            ...selectedRecipeItemAttributes,
        });
        return serialize(RecipeItem, result);
    }

    public async updateOutputOfRecipe(recipeId: string, dto: RecipeItemDto) {
        const result = await this.databaseService.prismaClient.recipeOutput.update({
            where: {
                itemId_recipeId: {
                    recipeId: recipeId,
                    itemId: dto.itemId,
                },
            },
            data: {
                quantity: dto.quantity,
            },
            ...selectedRecipeItemAttributes,
        });
        return serialize(RecipeItem, result);
    }

    public async removeOutputFromRecipe(recipeId: string, itemId: string) {
        await this.databaseService.prismaClient.recipeOutput.delete({
            where: {
                itemId_recipeId: {
                    recipeId: recipeId,
                    itemId: itemId,
                },
            },
        });
    }
}
