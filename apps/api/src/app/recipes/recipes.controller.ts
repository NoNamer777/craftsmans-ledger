import {
    CreateRecipeData,
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
    DEFAULT_SORT_ORDER,
    RecipeItemDto,
    RecipeQueryParams,
    ResourceTypes,
    serialize,
    SortOrder,
    UpdateRecipeData,
} from '@craftsmans-ledger/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
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
import { RecipeInputsService } from './recipe-inputs.service';
import { RecipeOutputsService } from './recipe-outputs.service';
import { RecipesService } from './recipes.service';

@Controller('/recipes')
export class RecipesController {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly recipeInputsService: RecipeInputsService,
        private readonly recipeOutputsService: RecipeOutputsService,
        private readonly cacheService: CacheService
    ) {}

    @Get()
    public async getAll() {
        return await this.recipesService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateRecipeData, @Res({ passthrough: true }) response: FastifyReply) {
        const url = response.request.url;
        const created = await this.recipesService.create(data);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        return created;
    }

    @Get('/query')
    public async query(
        @Query('limit') limit: number = DEFAULT_LIMIT,
        @Query('offset') offset: number = DEFAULT_OFFSET,
        @Query('sortOrder') sortOrder: SortOrder = DEFAULT_SORT_ORDER,
        @Query('techTreeIds', new ParseArrayPipe({ items: String, separator: ',', optional: true }))
        techTreeIds: string[] = [],
        @Query('maxTechPoints', new ParseArrayPipe({ items: Number, separator: ',', optional: true }))
        maxTechPoints: string[] = []
    ) {
        return await this.recipesService.query(
            serialize(RecipeQueryParams, { limit, offset, sortOrder, techTreeIds, maxTechPoints })
        );
    }

    @Get('/:recipeId')
    public async getById(@Param() recipeId: string) {
        const byId = await this.recipesService.getById(recipeId);

        if (!byId) {
            throw new NotFoundException(`Recipe with ID "${recipeId}" was not found`);
        }
        return byId;
    }

    @Put('/:recipeId')
    public async update(
        @Param('recipeId') recipeId: string,
        @Body() data: UpdateRecipeData,
        @Req() request: FastifyRequest
    ) {
        const url = request.url;

        if (recipeId !== data.id) {
            throw new BadRequestException(
                `It's not allowed to update Recipe on path "${url}" with data from Recipe with ID "${data.id}"`
            );
        }
        const updated = await this.recipesService.update(data);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return updated;
    }

    @Delete('/:recipeId')
    public async remove(@Param() recipeId: string) {
        await this.recipesService.remove(recipeId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }

    @Get('/:recipeId/inputs')
    public async getAllInputsOfRecipe(@Param('recipeId') recipeId: string) {
        return await this.recipeInputsService.getAllOfRecipe(recipeId);
    }

    @Post('/:recipeId/inputs')
    public async addInputToRecipe(
        @Param('recipeId') recipeId: string,
        @Body() data: RecipeItemDto,
        @Res({ passthrough: true }) response: FastifyReply
    ) {
        const result = await this.recipeInputsService.addInputToRecipe(recipeId, data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${result.item.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return result;
    }

    @Get('/:recipeId/inputs/:itemId')
    public async getInputOfRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        const result = await this.recipeInputsService.getInputOfRecipe(recipeId, itemId);

        if (!result) {
            throw new NotFoundException(
                `Recipe with ID "${recipeId}" does not have input with Item with ID "${itemId}"`
            );
        }
        return result;
    }

    @Put('/:recipeId/inputs/:itemId')
    public async updateRecipeInput(
        @Param('recipeId') recipeId: string,
        @Param('itemId') itemId: string,
        @Body() dto: RecipeItemDto,
        @Req() request: FastifyRequest
    ) {
        const url = request.url;

        if (dto.itemId !== itemId) {
            throw new BadRequestException(
                `It's not allowed to update input with Item "${itemId}" of Recipe with ID "${recipeId}" on path "${url}" with data from input with Item "${itemId}"`
            );
        }
        const updated = await this.recipeInputsService.updateInputOfRecipe(recipeId, dto);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
        return updated;
    }

    @Delete('/:recipeId/inputs/:itemId')
    public async removeInputFromRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        await this.recipeInputsService.removeInputFromRecipe(recipeId, itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }

    @Get('/:recipeId/outputs')
    public async getAllOutputsOfRecipe(@Param('recipeId') recipeId: string) {
        return await this.recipeOutputsService.getAllOfRecipe(recipeId);
    }

    @Post('/:recipeId/outputs')
    public async addOutputToRecipe(
        @Param('recipeId') recipeId: string,
        @Body() data: RecipeItemDto,
        @Res({ passthrough: true }) response: FastifyReply
    ) {
        const result = await this.recipeOutputsService.addOutputToRecipe(recipeId, data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${result.item.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return result;
    }

    @Get('/:recipeId/outputs/:itemId')
    public async getOutputOfRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        const result = await this.recipeOutputsService.getOutputOfRecipe(recipeId, itemId);

        if (!result) {
            throw new NotFoundException(
                `Recipe with ID "${recipeId}" does not have output with Item with ID "${itemId}"`
            );
        }
        return result;
    }

    @Put('/:recipeId/outputs/:itemId')
    public async updateRecipeOutput(
        @Param('recipeId') recipeId: string,
        @Param('itemId') itemId: string,
        @Body() dto: RecipeItemDto,
        @Req() request: FastifyRequest
    ) {
        const url = request.url;

        if (dto.itemId !== itemId) {
            throw new BadRequestException(
                `It's not allowed to update output with Item "${itemId}" of Recipe with ID "${recipeId}" on path "${url}" with data from output with Item "${itemId}"`
            );
        }
        const updated = await this.recipeOutputsService.updateOutputOfRecipe(recipeId, dto);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
        return updated;
    }

    @Delete('/:recipeId/outputs/:itemId')
    public async removeOutputFromRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        await this.recipeOutputsService.removeOutputFromRecipe(recipeId, itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }
}
