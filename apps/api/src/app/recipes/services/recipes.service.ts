import { CreateRecipeData, isSortOrder, RecipeQueryParams, UpdateRecipeData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TechnologyTreesService } from '../../technology-trees';
import { RecipesRepository } from '../repositories';

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

    public async query(queryParams: RecipeQueryParams) {
        if (queryParams.offset < 0) {
            throw new BadRequestException(`Offset "${queryParams.offset}" must be a positive whole number`);
        }
        if (queryParams.limit <= 0) {
            throw new BadRequestException(
                `Limit "${queryParams.limit}" must be a whole number greater than or equal to zero`
            );
        }
        if (!isSortOrder(queryParams.sortOrder)) {
            throw new BadRequestException(`Sort order must be either "asc" or "desc"`);
        }
        if (queryParams.techTreeIds.length !== queryParams.maxTechPoints.length) {
            throw new BadRequestException(`The number of Technology Trees and maximum Tech points are not the same`);
        }
        return await this.recipesRepository.query(queryParams);
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

    public async update(data: UpdateRecipeData) {
        const byId = await this.getById(data.id);

        if (!byId) {
            throw new NotFoundException(`Could not update Recipe with ID "${data.id}". - Reason: Recipe was not found`);
        }
        const technologyTree = await this.technologyService.getById(data.technologyTreeId);

        if (!technologyTree) {
            throw new NotFoundException(
                `Could not update Recipe with ID "${data.id}". - Reason: Technology Tree with ID "${data.technologyTreeId}" was not found`
            );
        }
        if (technologyTree.maxPoints > data.technologyPoints) {
            throw new BadRequestException(
                `Could not update Recipe with ID "${data.id}". - Reason: Max points "${data.technologyPoints}" is not allowed to be more than "${technologyTree.maxPoints}"`
            );
        }
        return await this.recipesRepository.update(data);
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
