import { Controller, Get } from '@nestjs/common';
import { TechnologyTreesService } from './technology-trees.service';

@Controller('/technology-trees')
export class TechnologyTreesController {
    constructor(private readonly technologyTreesService: TechnologyTreesService) {}

    @Get()
    public async getAll() {
        return await this.technologyTreesService.getAll();
    }
}
