import { CreateRecipeData } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    public async getAll() {
        return await this.recipesRepository.findAll();
    }

    public async create(data: CreateRecipeData) {
        return await this.recipesRepository.create(data);
    }
}
