import { Controller, Get } from '@nestjs/common';
import { RecipesService } from './recipes.service';

@Controller('/recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @Get()
    public async getAll() {
        return await this.recipesService.getAll();
    }
}
