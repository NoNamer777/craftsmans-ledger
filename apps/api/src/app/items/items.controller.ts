import { CreateItemData, Item, ResourceTypes } from '@craftsmans-ledger/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    Post,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CacheService } from '../core';
import { ItemsService } from './items.service';

@Controller('/items')
export class ItemsController {
    private readonly logger = new Logger(ItemsController.name);

    constructor(
        private readonly itemsService: ItemsService,
        private readonly cacheService: CacheService
    ) {}

    @Get()
    public async getAll() {
        this.logger.log('Received request to fetch all Items');
        return await this.itemsService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateItemData, @Res({ passthrough: true }) response: FastifyReply) {
        this.logger.log('Received request to create a new Item');

        const url = response.request.url;

        const created = await this.itemsService.create(data);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.ITEMS);
        return created;
    }

    @Get('/:itemId')
    public async getById(@Param('itemId') itemId: string) {
        this.logger.log(`Received request to fetch Item with ID "${itemId}"`);
        const byId = await this.itemsService.getById(itemId);

        if (!byId) {
            const error = new NotFoundException(`Item with ID "${itemId}" was not found`);

            this.logger.warn(error.message);
            throw error;
        }
        return byId;
    }

    @Put('/:itemId')
    public async update(@Param('itemId') itemId: string, @Body() data: Item, @Req() request: FastifyRequest) {
        this.logger.log(`Received request to update Item with ID "${itemId}"`);
        const url = request.url;

        if (itemId !== data.id) {
            this.logger.warn(`Invalid request. Body containing ID of Item "${itemId}" send to Item on path "${url}"`);
            throw new BadRequestException(
                `It's not allowed to update Item on path "${url}" with data from Item with ID "${data.id}"`
            );
        }
        const updated = await this.itemsService.update(data);
        this.cacheService.resetCacheOfType(ResourceTypes.ITEMS);

        return updated;
    }

    @Delete('/:itemId')
    public async remove(@Param('itemId') itemId: string) {
        this.logger.log(`Received request to remove Item with ID "${itemId}"`);
        await this.itemsService.remove(itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.ITEMS);
    }
}
