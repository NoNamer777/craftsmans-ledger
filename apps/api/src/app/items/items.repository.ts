import { Item, serializeAll } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class ItemsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const items = await this.databaseService.item.findMany();
        return serializeAll(Item, items);
    }
}
