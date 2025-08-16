import { CreateTechnologyTreeData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TechnologyTreesRepository } from './technology-trees.repository';

@Injectable()
export class TechnologyTreesService {
    constructor(private readonly technologyTreesRepository: TechnologyTreesRepository) {}

    public async getAll() {
        return await this.technologyTreesRepository.findAll();
    }

    public async getById(technologyTreeId: string) {
        return await this.technologyTreesRepository.findOneById(technologyTreeId);
    }

    public async create(data: CreateTechnologyTreeData) {
        if (await this.isNameTaken(data.name)) {
            throw new BadRequestException(
                `Could not create Technology Tree. - Reason: Name "${data.name}" is already in use`
            );
        }
        return await this.technologyTreesRepository.create(data);
    }

    public async remove(technologyTreeId: string) {
        const byId = await this.getById(technologyTreeId);

        if (!byId) {
            throw new NotFoundException(
                `Could not remove Technology Tree with ID "${technologyTreeId}". - Reason: Could not find Technology Tree`
            );
        }
        await this.technologyTreesRepository.remove(technologyTreeId);
    }

    private async getByName(name: string) {
        return await this.technologyTreesRepository.findOneByName(name);
    }

    private async isNameTaken(name: string) {
        const byName = await this.getByName(name);
        return Boolean(byName);
    }
}
