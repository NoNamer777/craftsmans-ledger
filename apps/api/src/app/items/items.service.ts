import { CreateItemData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
    constructor(private readonly itemsRepository: ItemsRepository) {}

    public async getAll() {
        return await this.itemsRepository.findAll();
    }

    public async create(data: CreateItemData) {
        if (await this.isNameTaken(data.name)) {
            throw new BadRequestException(`Could not create Item. - Reason: "${data.name}" is already in use`);
        }
        return await this.itemsRepository.create(data);
    }

    private async getByName(name: string) {
        return await this.itemsRepository.findOneByName(name);
    }

    private async isNameTaken(name: string) {
        const result = await this.getByName(name);
        return Boolean(result);
    }
}
