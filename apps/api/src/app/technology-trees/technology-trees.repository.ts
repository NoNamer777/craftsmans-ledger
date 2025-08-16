import { serializeAll, TechnologyTree } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class TechnologyTreesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.techTree.findMany();
        return serializeAll(TechnologyTree, results);
    }
}
