import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from '../../http';
import { serialize, serializeAll } from '../../utils';
import { CreateRecipeData, Recipe, UpdateRecipeData } from './models';

@Injectable({ providedIn: 'root' })
export class RecipesService {
    private readonly apiService = inject(ApiService);

    private readonly baseEndPoint = '/recipes';

    public getAll() {
        return this.apiService
            .get<Recipe[]>(this.baseEndPoint)
            .pipe(map((response) => serializeAll(Recipe, response.body)));
    }

    public create(recipe: CreateRecipeData) {
        return this.apiService
            .post<CreateRecipeData, Recipe>(this.baseEndPoint, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public getById(recipeId: string) {
        return this.apiService
            .get<Recipe>(`${this.baseEndPoint}/${recipeId}`)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public update(recipe: UpdateRecipeData) {
        return this.apiService
            .put<UpdateRecipeData, Recipe>(`${this.baseEndPoint}/${recipe.id}`, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public remove(recipeId: string) {
        return this.apiService.delete(`${this.baseEndPoint}/${recipeId}`);
    }
}
