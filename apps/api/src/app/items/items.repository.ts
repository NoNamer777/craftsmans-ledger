import { CreateItemData, Item, serialize, serializeAll } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class ItemsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.item.findMany();
        return serializeAll(Item, results);
    }

    public async findOneByName(name: string) {
        const result = await this.databaseService.item.findFirst({
            where: { name: name },
        });
        return serialize(Item, result);
    }

    public async create(data: CreateItemData) {
        const { name, weight, cost } = data;

        const created = await this.databaseService.item.create({
            data: {
                name: name,
                weight: weight,
                cost: cost,
            },
        });
        return serialize(Item, created);
    }
}
