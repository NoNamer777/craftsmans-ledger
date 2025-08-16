import { Injectable } from '@nestjs/common';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
    constructor(private readonly recipesRepository: RecipesRepository) {}

    public async getAll() {
        return await this.recipesRepository.findAll();
    }
}
