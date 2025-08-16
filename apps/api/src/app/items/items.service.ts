import { CreateItemData } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
    constructor(private readonly itemsRepository: ItemsRepository) {}

    public async getAll() {
        return await this.itemsRepository.findAll();
    }

    public async getById(itemId: string) {
        return await this.itemsRepository.findOneById(itemId);
    }

    public async create(data: CreateItemData) {
        if (await this.isNameTaken(data.name)) {
            throw new BadRequestException(`Could not create Item. - Reason: "${data.name}" is already in use`);
        }
        return await this.itemsRepository.create(data);
    }

    public async remove(itemId: string) {
        const byId = await this.getById(itemId);

        if (!byId) {
            throw new NotFoundException(`Could not remove Item with ID "${itemId}" - Reason: Item was not found`);
        }
        await this.itemsRepository.remove(itemId);
    }

    private async getByName(name: string) {
        return await this.itemsRepository.findOneByName(name);
    }

    private async isNameTaken(name: string) {
        const result = await this.getByName(name);
        return Boolean(result);
    }
}
