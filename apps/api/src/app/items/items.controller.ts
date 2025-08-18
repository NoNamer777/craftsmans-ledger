import { CreateItemData, Item, ResourceTypes } from '@craftsmans-ledger/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
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
    constructor(
        private readonly itemsService: ItemsService,
        private readonly cacheService: CacheService
    ) {}

    @Get()
    public async getAll() {
        return await this.itemsService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateItemData, @Res({ passthrough: true }) response: FastifyReply) {
        const url = response.request.url;

        const created = await this.itemsService.create(data);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.ITEMS);
        return created;
    }

    @Get('/:itemId')
    public async getById(@Param('itemId') itemId: string) {
        const byId = await this.itemsService.getById(itemId);

        if (!byId) throw new NotFoundException(`Item with ID "${itemId}" was not found`);
        return byId;
    }

    @Put('/:itemId')
    public async update(@Param('itemId') itemId: string, @Body() data: Item, @Req() request: FastifyRequest) {
        const url = request.url;

        if (itemId !== data.id) {
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
        await this.itemsService.remove(itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.ITEMS);
    }
}
