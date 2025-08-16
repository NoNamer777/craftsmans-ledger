import { Injectable } from '@nestjs/common';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
    constructor(private readonly itemsRepository: ItemsRepository) {}

    public async getAll() {
        return await this.itemsRepository.findAll();
    }
}
