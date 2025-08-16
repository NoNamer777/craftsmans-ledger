import { CreateTechnologyTreeData, serialize, serializeAll, TechnologyTree } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class TechnologyTreesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.techTree.findMany();
        return serializeAll(TechnologyTree, results);
    }

    public async findOneByName(name: string) {
        const result = await this.databaseService.techTree.findUnique({
            where: { name: name },
        });
        return serialize(TechnologyTree, result);
    }

    public async create(data: CreateTechnologyTreeData) {
        const created = await this.databaseService.techTree.create({
            data: {
                name: data.name,
                maxPoints: data.maxPoints,
            },
        });
        return serialize(TechnologyTree, created);
    }
}
