import { CreateRecipeData, UpdateRecipeData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TechnologyTreesService } from '../technology-trees';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
    constructor(
        private readonly technologyService: TechnologyTreesService,
        private readonly recipesRepository: RecipesRepository
    ) {}

    public async getAll() {
        return await this.recipesRepository.findAll();
    }

    public async getById(recipeId: string) {
        return await this.recipesRepository.findOneById(recipeId);
    }

    public async create(data: CreateRecipeData) {
        const technologyTree = await this.technologyService.getById(data.technologyTreeId);

        if (!technologyTree) {
            throw new NotFoundException(
                `Could not create Recipe. - Reason: Technology Tree with ID "${data.technologyTreeId}" was not found`
            );
        }
        if (technologyTree.maxPoints > data.technologyPoints) {
            throw new BadRequestException(
                `Could not create Recipe. - Reason: Max points "${data.technologyPoints}" is not allowed to be more than "${technologyTree.maxPoints}"`
            );
        }
        return await this.recipesRepository.create(data);
    }

    public async remove(recipeId: string) {
        const byId = await this.getById(recipeId);

        if (!byId) {
            throw new NotFoundException(
                `"Could not remove Recipe with ID "${recipeId}". - Reason: Recipe is not found`
            );
        }
        await this.recipesRepository.remove(recipeId);
    }
}
