import { CreateTechnologyTreeData } from '@craftsmans-ledger/shared';
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Res } from '@nestjs/common';
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

    @Get('/:technologyTreeId')
    public async getById(@Param('technologyTreeId') technologyTreeId: string) {
        const byId = await this.technologyTreesService.getById(technologyTreeId);

        if (!byId) {
            throw new NotFoundException(`Technology Tree with ID "${technologyTreeId}" was not found`);
        }
        return byId;
    }

    @Delete('/:technologyTreeId')
    public async remove(@Param('technologyTreeId') technologyTreeId: string) {
        await this.technologyTreesService.remove(technologyTreeId);
    }
}
