import { CreateRecipeData, Recipe, serialize, serializeAll } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class RecipesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.recipe.findMany();
        return serializeAll(Recipe, results);
    }

    public async findOneById(recipeId: string) {
        const result = await this.databaseService.recipe.findUnique({
            where: { id: recipeId },
        });
        return serialize(Recipe, result);
    }

    public async create(data: CreateRecipeData) {
        const result = await this.databaseService.recipe.create({
            data: {
                craftingTime: data.craftingTime,
                techTreeId: data.technologyTreeId,
                techPoints: data.technologyPoints,
            },
        });
        return serialize(Recipe, result);
    }
}
