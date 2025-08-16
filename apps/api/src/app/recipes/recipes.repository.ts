import { CreateRecipeData, Recipe, serialize, serializeAll, UpdateRecipeData } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';
import { selectedRecipeAttributes } from './models';

@Injectable()
export class RecipesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.recipe.findMany({ ...selectedRecipeAttributes });
        return serializeAll(Recipe, results);
    }

    public async findOneById(recipeId: string) {
        const result = await this.databaseService.recipe.findUnique({
            ...selectedRecipeAttributes,
            where: { id: recipeId },
        });
        return serialize(Recipe, result);
    }

    public async create(data: CreateRecipeData) {
        const result = await this.databaseService.recipe.create({
            ...selectedRecipeAttributes,
            data: {
                craftingTime: data.craftingTime,
                techTreeId: data.technologyTreeId,
                techPoints: data.technologyPoints,
            },
        });
        return serialize(Recipe, result);
    }

    public async update(data: UpdateRecipeData) {
        const result = await this.databaseService.recipe.update({
            ...selectedRecipeAttributes,
            where: { id: data.id },
            data: {
                craftingTime: data.craftingTime,
                techTreeId: data.technologyTreeId,
                techPoints: data.technologyPoints,
            },
        });
        return serialize(Recipe, result);
    }

    public async remove(recipeId: string) {
        await this.databaseService.recipe.delete({ where: { id: recipeId } });
    }
}
