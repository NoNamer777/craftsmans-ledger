import { CreateRecipeData } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    public async getAll() {
        return await this.recipesRepository.findAll();
    }

    public async getById(recipeId: string) {
        return await this.recipesRepository.findOneById(recipeId);
    }

    public async create(data: CreateRecipeData) {
        return await this.recipesRepository.create(data);
    }
}
