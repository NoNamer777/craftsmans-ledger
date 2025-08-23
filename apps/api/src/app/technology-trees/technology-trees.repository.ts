import { CreateTechnologyTreeData, serialize, serializeAll, TechnologyTree } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core';

@Injectable()
export class TechnologyTreesRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    public async findAll() {
        const results = await this.databaseService.prismaClient.techTree.findMany();
        return serializeAll(TechnologyTree, results);
    }

    public async findOneById(technologyTreeId: string) {
        const result = await this.databaseService.prismaClient.techTree.findUnique({
            where: { id: technologyTreeId },
        });
        return serialize(TechnologyTree, result);
    }

    public async findOneByName(name: string) {
        const result = await this.databaseService.prismaClient.techTree.findUnique({
            where: { name: name },
        });
        return serialize(TechnologyTree, result);
    }

    public async create(data: CreateTechnologyTreeData) {
        const created = await this.databaseService.prismaClient.techTree.create({
            data: {
                name: data.name,
                maxPoints: data.maxPoints,
            },
        });
        return serialize(TechnologyTree, created);
    }

    public async update(data: TechnologyTree) {
        const updated = await this.databaseService.prismaClient.techTree.update({
            where: { id: data.id },
            data: {
                name: data.name,
                maxPoints: data.maxPoints,
            },
        });
        return serialize(TechnologyTree, updated);
    }

    public async remove(technologyTreeId: string) {
        await this.databaseService.prismaClient.techTree.delete({ where: { id: technologyTreeId } });
    }
}
