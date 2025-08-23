import {
    CreateRecipeData,
    PaginatedResponse,
    Recipe,
    RecipeQueryParams,
    serialize,
    serializeAll,
    UpdateRecipeData,
} from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';
import { selectedRecipeAttributes } from './models';

@Injectable()
export class RecipesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.prismaClient.recipe.findMany({ ...selectedRecipeAttributes });
        return serializeAll(Recipe, results);
    }

    public async findOneById(recipeId: string) {
        const result = await this.databaseService.prismaClient.recipe.findUnique({
            ...selectedRecipeAttributes,
            where: { id: recipeId },
        });
        return serialize(Recipe, result);
    }

    public async query(queryParams: RecipeQueryParams) {
        const response = new PaginatedResponse<Recipe>();

        const query: Parameters<typeof this.databaseService.prismaClient.recipe.count>[0] = {
            skip: queryParams.offset,
            take: queryParams.limit,
            ...(queryParams.maxTechPoints.length === 0
                ? {}
                : {
                      where: {
                          OR: queryParams.maxTechPoints.map((techPoints, index) => ({
                              technologyTree: {
                                  id: queryParams.techTreeIds[index],
                              },
                              techPoints: {
                                  lte: techPoints,
                              },
                          })),
                      },
                  }),
        };
        const countQuery = { ...query };
        delete countQuery.skip;
        delete countQuery.take;

        const count = await this.databaseService.prismaClient.recipe.count(countQuery);
        const results = await this.databaseService.prismaClient.recipe.findMany({
            ...query,
            ...selectedRecipeAttributes,
        });

        response.lastPage = Math.ceil(count / queryParams.limit);
        response.page = Math.floor(((queryParams.limit + queryParams.offset) / count) * response.lastPage);

        response.count = count;
        response.data = serializeAll(Recipe, results);
        return response;
    }

    public async create(data: CreateRecipeData) {
        const result = await this.databaseService.prismaClient.recipe.create({
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
        const result = await this.databaseService.prismaClient.recipe.update({
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
        await this.databaseService.prismaClient.recipe.delete({ where: { id: recipeId } });
    }
}
