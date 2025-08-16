import { Injectable } from '@nestjs/common';
import { TechnologyTreesRepository } from './technology-trees.repository';

@Injectable()
export class TechnologyTreesService {
    constructor(private readonly technologyTreesRepository: TechnologyTreesRepository) {}

    public async getAll() {
        return await this.technologyTreesRepository.findAll();
    }
}
