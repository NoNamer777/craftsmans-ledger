import { inject, Injectable } from '@angular/core';
import {
    CreateRecipeData,
    PaginatedResponse,
    QueryParams,
    Recipe,
    RecipeItem,
    RecipeItemDto,
    serialize,
    serializeAll,
    UpdateRecipeData,
} from '@craftsmans-ledger/shared';
import { from, map, of, tap } from 'rxjs';
import { StorageKeys } from '../../browser-storage';
import { CacheService } from '../../cache';
import { RecipeFilters } from '../../filters';
import { ApiService } from '../../http';

@Injectable({ providedIn: 'root' })
export class RecipesService {
    private readonly apiService = inject(ApiService);
    private readonly cacheService = new CacheService(StorageKeys.CACHE_RECIPES, Recipe);

    private readonly baseEndPoint = '/recipes';

    private readonly inputsEndPoint = `${this.baseEndPoint}/:recipeId/inputs`;

    private readonly outputsEndPoint = `${this.baseEndPoint}/:recipeId/outputs`;

    public initialize() {
        return from(this.cacheService.loadCacheFromStorage());
    }

    public clearCache() {
        this.cacheService.clear();
    }

    public getAll() {
        if (this.cacheService.hasCache) return of(this.cacheService.cache);
        return this.apiService.get<Recipe[]>(this.baseEndPoint).pipe(
            map((response) => serializeAll(Recipe, response.body)),
            tap((recipes) => (this.cacheService.cache = recipes))
        );
    }

    public query(filters?: RecipeFilters) {
        const queryParams: QueryParams = {};

        if (filters?.technologyFilters.length > 0) {
            queryParams['technologyTreeIds'] = filters.technologyFilters
                .map((filter) => filter.technologyTree.id)
                .join(',');
            queryParams['maxTechPoints'] = filters.technologyFilters.map((filter) => filter.maxPoints).join(',');
        }
        return this.apiService.get<PaginatedResponse<Recipe>>(`${this.baseEndPoint}/query`, queryParams).pipe(
            map((response) => {
                const data = response.body;

                data.data = serializeAll(Recipe, data.data);
                return data;
            })
        );
    }

    public create(recipe: CreateRecipeData) {
        return this.apiService
            .post<CreateRecipeData, Recipe>(this.baseEndPoint, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public getById(recipeId: string) {
        const fetchFromApi = this.apiService
            .get<Recipe>(`${this.baseEndPoint}/${recipeId}`)
            .pipe(map((response) => serialize(Recipe, response.body)));

        if (this.cacheService.hasCache) {
            const cachedResource = this.cacheService.getResourceById(recipeId);
            return cachedResource ? of(cachedResource) : fetchFromApi;
        }
        return fetchFromApi;
    }

    public update(recipe: UpdateRecipeData) {
        return this.apiService
            .put<UpdateRecipeData, Recipe>(`${this.baseEndPoint}/${recipe.id}`, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public remove(recipeId: string) {
        return this.apiService.delete(`${this.baseEndPoint}/${recipeId}`);
    }

    public getAllInputsOfRecipe(recipeId: string) {
        return this.apiService
            .get<RecipeItem[]>(this.inputsEndPoint.replace(':recipeId', recipeId))
            .pipe(map((response) => serializeAll(RecipeItem, response.body)));
    }

    public getInputOfRecipe(recipeId: string, itemId: string) {
        return this.apiService
            .get<RecipeItem>(`${this.inputsEndPoint.replace(':recipeId', recipeId)}/${itemId}`)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public addInputToRecipe(recipeId: string, dto: RecipeItemDto) {
        return this.apiService
            .post<RecipeItemDto, RecipeItem>(this.inputsEndPoint.replace(':recipeId', recipeId), dto)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public updateRecipeInput(recipeId: string, dto: RecipeItemDto) {
        return this.apiService
            .put<RecipeItemDto, RecipeItem>(`${this.inputsEndPoint.replace(':recipeId', recipeId)}/${dto.itemId}`, dto)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public removeInputFromRecipe(recipeId: string, itemId: string) {
        return this.apiService.delete(`${this.inputsEndPoint.replace(':recipeId', recipeId)}/${itemId}`);
    }

    public getAllOutputsOfRecipe(recipeId: string) {
        return this.apiService
            .get<RecipeItem[]>(this.outputsEndPoint.replace(':recipeId', recipeId))
            .pipe(map((response) => serializeAll(RecipeItem, response.body)));
    }

    public getOutputOfRecipe(recipeId: string, itemId: string) {
        return this.apiService
            .get<RecipeItem>(`${this.outputsEndPoint.replace(':recipeId', recipeId)}/${itemId}`)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public addOutputToRecipe(recipeId: string, dto: RecipeItemDto) {
        return this.apiService
            .post<RecipeItemDto, RecipeItem>(this.outputsEndPoint.replace(':recipeId', recipeId), dto)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public updateRecipeOutput(recipeId: string, dto: RecipeItemDto) {
        return this.apiService
            .put<RecipeItemDto, RecipeItem>(`${this.outputsEndPoint.replace(':recipeId', recipeId)}/${dto.itemId}`, dto)
            .pipe(map((response) => serialize(RecipeItem, response.body)));
    }

    public removeOutputFromRecipe(recipeId: string, itemId: string) {
        return this.apiService.delete(`${this.outputsEndPoint.replace(':recipeId', recipeId)}/${itemId}`);
    }
}
