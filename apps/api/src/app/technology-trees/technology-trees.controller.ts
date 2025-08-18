import { CreateTechnologyTreeData, ResourceTypes, TechnologyTree } from '@craftsmans-ledger/shared';
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
import { TechnologyTreesService } from './technology-trees.service';

@Controller('/technology-trees')
export class TechnologyTreesController {
    constructor(
        private readonly technologyTreesService: TechnologyTreesService,
        private readonly cacheService: CacheService
    ) {}

    @Get()
    public async getAll() {
        return await this.technologyTreesService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateTechnologyTreeData, @Res({ passthrough: true }) response: FastifyReply) {
        const created = await this.technologyTreesService.create(data);
        const url = response.request.url;

        this.cacheService.resetCacheOfType(ResourceTypes.TECHNOLOGY_TREES);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
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

    @Put('/:technologyTreeId')
    public async update(
        @Param('technologyTreeId') technologyTreeId: string,
        @Body() data: TechnologyTree,
        @Req() request: FastifyRequest
    ) {
        const url = request.url;

        if (technologyTreeId !== data.id) {
            throw new BadRequestException(
                `It's not allowed to update Technology Tree on path "${url}" with data from Technology Tree with ID "${data.id}"`
            );
        }
        const updated = await this.technologyTreesService.update(data);

        this.cacheService.resetCacheOfType(ResourceTypes.TECHNOLOGY_TREES);
        return updated;
    }

    @Delete('/:technologyTreeId')
    public async remove(@Param('technologyTreeId') technologyTreeId: string) {
        await this.technologyTreesService.remove(technologyTreeId);
        this.cacheService.resetCacheOfType(ResourceTypes.TECHNOLOGY_TREES);
    }
}
