import { CreateTechnologyTreeData } from '@craftsmans-ledger/shared';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { TechnologyTreesService } from './technology-trees.service';

@Controller('/technology-trees')
export class TechnologyTreesController {
    constructor(private readonly technologyTreesService: TechnologyTreesService) {}

    @Get()
    public async getAll() {
        return await this.technologyTreesService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateTechnologyTreeData, @Res({ passthrough: true }) response: FastifyReply) {
        const created = await this.technologyTreesService.create(data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ location: `${url}/${created.id}` });
        return created;
    }
}
