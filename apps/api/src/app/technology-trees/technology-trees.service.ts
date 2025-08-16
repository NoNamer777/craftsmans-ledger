import { CreateTechnologyTreeData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TechnologyTreesRepository } from './technology-trees.repository';

@Injectable()
export class TechnologyTreesService {
    constructor(private readonly technologyTreesRepository: TechnologyTreesRepository) {}

    public async getAll() {
        return await this.technologyTreesRepository.findAll();
    }

    public async create(data: CreateTechnologyTreeData) {
        if (await this.isNameTaken(data.name)) {
            throw new BadRequestException(
                `Could not create Technology Tree. - Reason: Name "${data.name}" is already in use`
            );
        }
        return await this.technologyTreesRepository.create(data);
    }

    private async getByName(name: string) {
        return await this.technologyTreesRepository.findOneByName(name);
    }

    private async isNameTaken(name: string) {
        const byName = await this.getByName(name);
        return Boolean(byName);
    }
}
