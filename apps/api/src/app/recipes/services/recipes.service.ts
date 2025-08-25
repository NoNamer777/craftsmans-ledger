import { CreateRecipeData, UpdateRecipeData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TechnologyTreesService } from '../../technology-trees';
import { RecipesRepository } from '../repositories';

@Injectable()
export class RecipesService {
    private readonly technologyService: TechnologyTreesService;
    private readonly recipesRepository: RecipesRepository;
    private readonly logger = new Logger(RecipesService.name);

    constructor(technologyService: TechnologyTreesService, recipesRepository: RecipesRepository) {
        this.technologyService = technologyService;
        this.recipesRepository = recipesRepository;
    }

    public async getAll() {
        return await this.recipesRepository.findAll();
    }

    public async getById(recipeId: string) {
        return await this.recipesRepository.findOneById(recipeId);
    }

    public async create(data: CreateRecipeData) {
        const technologyTree = await this.technologyService.getById(data.technologyTreeId);

        if (!technologyTree) {
            const error = new NotFoundException(
                `Could not create Recipe. - Reason: Technology Tree with ID "${data.technologyTreeId}" was not found`
            );
            this.logger.warn(error.message);
            throw error;
        }
        if (technologyTree.maxPoints < data.techPoints) {
            const error = new BadRequestException(
                `Could not create Recipe. - Reason: Max points "${data.techPoints}" is not allowed to be more than "${technologyTree.maxPoints}"`
            );
            this.logger.warn(error.message);
            throw error;
        }
        return await this.recipesRepository.create(data);
    }

    public async update(data: UpdateRecipeData) {
        const byId = await this.getById(data.id);

        if (!byId) {
            const error = new NotFoundException(
                `Could not update Recipe with ID "${data.id}". - Reason: Recipe was not found`
            );
            this.logger.warn(error.message);

            throw error;
        }
        const technologyTree = await this.technologyService.getById(data.technologyTreeId);

        if (!technologyTree) {
            const error = new NotFoundException(
                `Could not update Recipe with ID "${data.id}". - Reason: Technology Tree with ID "${data.technologyTreeId}" was not found`
            );
            this.logger.warn(error.message);

            throw error;
        }
        if (technologyTree.maxPoints < data.techPoints) {
            const error = new BadRequestException(
                `Could not update Recipe with ID "${data.id}". - Reason: Max points "${data.techPoints}" is not allowed to be more than "${technologyTree.maxPoints}"`
            );
            this.logger.warn(error.message);

            throw error;
        }
        return await this.recipesRepository.update(data);
    }

    public async remove(recipeId: string) {
        const byId = await this.getById(recipeId);

        if (!byId) {
            const error = new NotFoundException(
                `"Could not remove Recipe with ID "${recipeId}". - Reason: Recipe is not found`
            );
            this.logger.warn(error.message);

            throw error;
        }
        await this.recipesRepository.remove(recipeId);
    }
}
