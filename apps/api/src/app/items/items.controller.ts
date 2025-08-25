import {
    CreateItemData,
    DEFAULT_ITEM_SORTING_ATTRIBUTE,
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
    DEFAULT_SORT_ORDER,
    Item,
    ItemQueryParamNames,
    ItemQueryParams,
    ResourceTypes,
    serialize,
    SortableItemAttribute,
    SortOrder,
    StandardQueryParamNames,
} from '@craftsmans-ledger/shared';
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
    ParseArrayPipe,
    Post,
    Put,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CacheService } from '../core';
import { ItemsService } from './items.service';

@Controller('/items')
export class ItemsController {
    private readonly itemsService: ItemsService;
    private readonly cacheService: CacheService;
    private readonly logger = new Logger(ItemsController.name);

    constructor(itemsService: ItemsService, cacheService: CacheService) {
        this.itemsService = itemsService;
        this.cacheService = cacheService;
    }

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

    @Get('/query')
    public async query(
        @Query(StandardQueryParamNames.OFFSET) offset: number = DEFAULT_OFFSET,
        @Query(StandardQueryParamNames.LIMIT) limit: number = DEFAULT_LIMIT,
        @Query(StandardQueryParamNames.ORDER) order: SortOrder = DEFAULT_SORT_ORDER,
        @Query(StandardQueryParamNames.SORT_BY) sortBy: SortableItemAttribute = DEFAULT_ITEM_SORTING_ATTRIBUTE,
        @Query(ItemQueryParamNames.NAME) name: string = null,
        @Query(ItemQueryParamNames.TECH_TREE_IDS, new ParseArrayPipe({ separator: ',', items: String, optional: true }))
        techTreeIds: string[] = [],
        @Query(
            ItemQueryParamNames.MAX_TECH_POINTS,
            new ParseArrayPipe({ separator: ',', items: Number, optional: true })
        )
        maxTechPoints: number[] = []
    ) {
        this.logger.log('Received request to query Items');

        return this.itemsService.query(
            serialize(ItemQueryParams, {
                [StandardQueryParamNames.OFFSET]: offset,
                [StandardQueryParamNames.LIMIT]: limit,
                [StandardQueryParamNames.ORDER]: order,
                [StandardQueryParamNames.SORT_BY]: sortBy,
                [ItemQueryParamNames.NAME]: name,
                [ItemQueryParamNames.TECH_TREE_IDS]: techTreeIds,
                [ItemQueryParamNames.MAX_TECH_POINTS]: maxTechPoints,
            })
        );
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
            const error = new BadRequestException(
                `It's not allowed to update Item on path "${url}" with data from Item with ID "${data.id}"`
            );
            this.logger.warn(error.message);

            throw error;
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
