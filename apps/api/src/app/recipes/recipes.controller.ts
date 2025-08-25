import { CreateRecipeData, RecipeItemDto, ResourceTypes, UpdateRecipeData } from '@craftsmans-ledger/shared';
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
    Post,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CacheService } from '../core';
import { RecipeInputsService, RecipeOutputsService, RecipesService } from './services';

@Controller('/recipes')
export class RecipesController {
    private readonly recipesService: RecipesService;
    private readonly recipeInputsService: RecipeInputsService;
    private readonly recipeOutputsService: RecipeOutputsService;
    private readonly cacheService: CacheService;
    private readonly logger = new Logger(RecipesController.name);

    constructor(
        recipesService: RecipesService,
        recipeInputsService: RecipeInputsService,
        recipeOutputsService: RecipeOutputsService,
        cacheService: CacheService
    ) {
        this.recipesService = recipesService;
        this.recipeInputsService = recipeInputsService;
        this.recipeOutputsService = recipeOutputsService;
        this.cacheService = cacheService;
    }

    @Get()
    public async getAll() {
        this.logger.log('Received request to fetch all Recipes');
        return await this.recipesService.getAll();
    }

    @Post()
    public async create(@Body() data: CreateRecipeData, @Res({ passthrough: true }) response: FastifyReply) {
        this.logger.log('Received request to create a new Recipe');
        const url = response.request.url;
        const created = await this.recipesService.create(data);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${created.id}` });
        return created;
    }

    @Get('/:recipeId')
    public async getById(@Param('recipeId') recipeId: string) {
        this.logger.log(`Received request to fetch Recipe with ID "${recipeId}"`);
        const byId = await this.recipesService.getById(recipeId);

        if (!byId) {
            const error = new NotFoundException(`Recipe with ID "${recipeId}" was not found`);
            this.logger.warn(error.message);

            throw error;
        }
        return byId;
    }

    @Put('/:recipeId')
    public async update(
        @Param('recipeId') recipeId: string,
        @Body() data: UpdateRecipeData,
        @Req() request: FastifyRequest
    ) {
        this.logger.log(`Received request to update Recipe with ID "${recipeId}"`);
        const url = request.url;

        if (recipeId !== data.id) {
            const error = new BadRequestException(
                `It's not allowed to update Recipe on path "${url}" with data from Recipe with ID "${data.id}"`
            );
            this.logger.warn(error.message);

            throw error;
        }
        const updated = await this.recipesService.update(data);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return updated;
    }

    @Delete('/:recipeId')
    public async remove(@Param('recipeId') recipeId: string) {
        this.logger.log(`Received request to remove Recipe with ID "${recipeId}"`);
        await this.recipesService.remove(recipeId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }

    @Get('/:recipeId/inputs')
    public async getAllInputsOfRecipe(@Param('recipeId') recipeId: string) {
        this.logger.log(`Received request to fetch all inputs of Recipe with ID "${recipeId}"`);
        return await this.recipeInputsService.getAllOfRecipe(recipeId);
    }

    @Post('/:recipeId/inputs')
    public async addInputToRecipe(
        @Param('recipeId') recipeId: string,
        @Body() data: RecipeItemDto,
        @Res({ passthrough: true }) response: FastifyReply
    ) {
        this.logger.log(`Received request to add a new input to Recipe with ID "${recipeId}"`);
        const result = await this.recipeInputsService.addInputToRecipe(recipeId, data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${result.item.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return result;
    }

    @Get('/:recipeId/inputs/:itemId')
    public async getInputOfRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        this.logger.log(
            `Received request to fetch input of Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        const result = await this.recipeInputsService.getInputOfRecipe(recipeId, itemId);

        if (!result) {
            const error = new NotFoundException(
                `Recipe with ID "${recipeId}" does not have input with Item with ID "${itemId}"`
            );
            this.logger.warn(error.message);
            throw error;
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
        this.logger.log(
            `Received request to update input of Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        const url = request.url;

        if (dto.itemId !== itemId) {
            const error = new BadRequestException(
                `It's not allowed to update input with Item "${itemId}" of Recipe with ID "${recipeId}" on path "${url}" with data from input with Item "${itemId}"`
            );
            this.logger.warn(error.message);
            throw error;
        }
        const updated = await this.recipeInputsService.updateInputOfRecipe(recipeId, dto);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
        return updated;
    }

    @Delete('/:recipeId/inputs/:itemId')
    public async removeInputFromRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        this.logger.log(
            `Received request to remove input from Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        await this.recipeInputsService.removeInputFromRecipe(recipeId, itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }

    @Get('/:recipeId/outputs')
    public async getAllOutputsOfRecipe(@Param('recipeId') recipeId: string) {
        this.logger.log(`Received request to fetch all outputs of Recipe with ID "${recipeId}"`);
        return await this.recipeOutputsService.getAllOfRecipe(recipeId);
    }

    @Post('/:recipeId/outputs')
    public async addOutputToRecipe(
        @Param('recipeId') recipeId: string,
        @Body() data: RecipeItemDto,
        @Res({ passthrough: true }) response: FastifyReply
    ) {
        this.logger.log(`Received request to add a new output to Recipe with ID "${recipeId}"`);
        const result = await this.recipeOutputsService.addOutputToRecipe(recipeId, data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ Location: `${url}/${result.item.id}` });
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);

        return result;
    }

    @Get('/:recipeId/outputs/:itemId')
    public async getOutputOfRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        this.logger.log(
            `Received request to fetch output of Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        const result = await this.recipeOutputsService.getOutputOfRecipe(recipeId, itemId);

        if (!result) {
            const error = new NotFoundException(
                `Recipe with ID "${recipeId}" does not have output with Item with ID "${itemId}"`
            );
            this.logger.warn(error.message);

            throw error;
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
        this.logger.log(
            `Received request to update output of Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        const url = request.url;

        if (dto.itemId !== itemId) {
            const error = new BadRequestException(
                `It's not allowed to update output with Item "${itemId}" of Recipe with ID "${recipeId}" on path "${url}" with data from output with Item "${itemId}"`
            );
            this.logger.warn(error.message);

            throw error;
        }
        const updated = await this.recipeOutputsService.updateOutputOfRecipe(recipeId, dto);

        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
        return updated;
    }

    @Delete('/:recipeId/outputs/:itemId')
    public async removeOutputFromRecipe(@Param('recipeId') recipeId: string, @Param('itemId') itemId: string) {
        this.logger.log(
            `Received request to remove output from Recipe with ID "${recipeId}" where Item has ID "${itemId}"`
        );
        await this.recipeOutputsService.removeOutputFromRecipe(recipeId, itemId);
        this.cacheService.resetCacheOfType(ResourceTypes.RECIPES);
    }
}
