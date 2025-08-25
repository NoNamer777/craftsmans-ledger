import { CreateItemData, Item, ItemQueryParams, SortableItemAttributes } from '@craftsmans-ledger/shared';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
    private readonly itemsRepository: ItemsRepository;
    private readonly logger = new Logger(ItemsService.name);

    constructor(itemsRepository: ItemsRepository) {
        this.itemsRepository = itemsRepository;
    }

    public async getAll() {
        return await this.itemsRepository.findAll();
    }

    public async query(queryParams: ItemQueryParams) {
        const sortableOptions: string[] = Object.values(SortableItemAttributes);

        if (queryParams.techTreeIds.length !== queryParams.maxTechPoints.length) {
            const error = new BadRequestException(
                `The number of Technology Trees IDs "${queryParams.techTreeIds.length}" and maximum Tech points "${queryParams.maxTechPoints.length}" are not the same`
            );
            this.logger.warn(error.message);

            throw error;
        }
        if (!sortableOptions.includes(queryParams.sortBy)) {
            const error = new BadRequestException(
                `Unknown sorting option "${queryParams.sortBy}". Available options are: [${sortableOptions.map((option) => `"${option}"`).join(', ')}]`
            );
            this.logger.warn(error.message);

            throw error;
        }
        return await this.itemsRepository.query(queryParams);
    }

    public async getById(itemId: string) {
        return await this.itemsRepository.findOneById(itemId);
    }

    public async create(data: CreateItemData) {
        if (await this.isNameTaken(data.name)) {
            const error = new BadRequestException(`Could not create Item. - Reason: "${data.name}" is already in use`);
            this.logger.warn(error.message);

            throw error;
        }
        return await this.itemsRepository.create(data);
    }

    public async update(data: Item) {
        const byId = await this.getById(data.id);

        if (!byId) {
            const error = new NotFoundException(
                `Could not update Item with ID "${data.id}". - Reason: Item was not found`
            );
            this.logger.warn(error.message);

            throw error;
        }
        if (await this.isNameTaken(data.name, data.id)) {
            const error = new BadRequestException(
                `Could not update Item with ID "${data.id}". - Reason: Name "${data.name}" is already in use`
            );
            this.logger.warn(error.message);

            throw error;
        }
        return await this.itemsRepository.update(data);
    }

    public async remove(itemId: string) {
        const byId = await this.getById(itemId);

        if (!byId) {
            const error = new NotFoundException(
                `Could not remove Item with ID "${itemId}" - Reason: Item was not found`
            );
            this.logger.warn(error.message);

            throw error;
        }
        await this.itemsRepository.remove(itemId);
    }

    private async getByName(name: string) {
        return await this.itemsRepository.findOneByName(name);
    }

    private async isNameTaken(name: string, itemId?: string) {
        const result = await this.getByName(name);
        return Boolean(result) && (!itemId || itemId !== result.id);
    }
}
