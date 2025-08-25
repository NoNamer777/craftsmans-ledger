import {
    CreateItemData,
    Item,
    ItemQueryParams,
    PaginatedResponse,
    serialize,
    serializeAll,
} from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class ItemsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.prismaClient.item.findMany({
            orderBy: { name: 'asc' },
        });
        return serializeAll(Item, results);
    }

    public async query(queryParams: ItemQueryParams) {
        const whereCondition = {
            ...(queryParams.techTreeIds.length > 0
                ? {
                      where: {
                          OR: [
                              {
                                  recipeOutputs: {
                                      some: {
                                          OR: queryParams.maxTechPoints.map((techPoints, index) => ({
                                              recipe: {
                                                  technologyTree: {
                                                      id: queryParams.techTreeIds[index],
                                                  },
                                                  techPoints: {
                                                      lte: techPoints,
                                                  },
                                              },
                                          })),
                                      },
                                  },
                              },
                              {
                                  recipeOutputs: { none: {} },
                              },
                          ],
                      },
                  }
                : {}),
        };

        const totalResults = await this.databaseService.prismaClient.item.count(whereCondition);

        const results = await this.databaseService.prismaClient.item.findMany({
            orderBy: { [queryParams.sortBy]: queryParams.order },
            skip: queryParams.offset,
            take: queryParams.limit,
            ...whereCondition,
        });

        const response = new PaginatedResponse();
        response.count = totalResults;
        response.lastPage = Math.ceil(totalResults / queryParams.limit);
        response.page = Math.floor(
            response.lastPage * Math.min(1, (queryParams.offset + queryParams.limit) / totalResults)
        );
        response.data = serializeAll(Item, results);

        return response;
    }

    public async findOneById(itemId: string) {
        const result = await this.databaseService.prismaClient.item.findUnique({
            where: { id: itemId },
        });
        return serialize(Item, result);
    }

    public async findOneByName(name: string) {
        const result = await this.databaseService.prismaClient.item.findUnique({
            where: { name: name },
        });
        return serialize(Item, result);
    }

    public async create(data: CreateItemData) {
        const { name, weight, cost } = data;

        const created = await this.databaseService.prismaClient.item.create({
            data: {
                name: name,
                weight: weight,
                cost: cost,
            },
        });
        return serialize(Item, created);
    }

    public async update(data: Item) {
        const updated = await this.databaseService.prismaClient.item.update({
            where: { id: data.id },
            data: {
                name: data.name,
                cost: data.cost,
                weight: data.weight,
            },
        });
        return serialize(Item, updated);
    }

    public async remove(itemId: string) {
        await this.databaseService.prismaClient.item.delete({ where: { id: itemId } });
    }
}
