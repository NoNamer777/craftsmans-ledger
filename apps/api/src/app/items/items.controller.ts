import { CreateItemData } from '@craftsmans-ledger/shared';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ItemsService } from './items.service';

@Controller('/items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    public async getAll() {
        return await this.itemsService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateItemData, @Res({ passthrough: true }) response: FastifyReply) {
        const url = response.request.url;

        const created = await this.itemsService.create(data);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        return created;
    }
}
