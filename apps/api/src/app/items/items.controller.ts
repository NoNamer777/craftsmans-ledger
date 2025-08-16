import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('/items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Get()
    public async getAll() {
        return await this.itemsService.getAll();
    }
}
