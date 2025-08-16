import { CreateRecipeData } from '@craftsmans-ledger/shared';
import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { RecipesService } from './recipes.service';

@Controller('/recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    @Get()
    public async getAll() {
        return await this.recipesService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateRecipeData, @Res({ passthrough: true }) response: FastifyReply) {
        const created = await this.recipesService.create(data);

        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        return created;
    }
}
