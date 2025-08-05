import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from '../../http';
import { serialize, serializeAll } from '../../utils';
import { CreateRecipeData, Recipe } from './models';

@Injectable({ providedIn: 'root' })
export class RecipesService {
    private readonly apiService = inject(ApiService);

    private readonly endPoint = '/recipes';

    public getAll() {
        return this.apiService.get<Recipe[]>(this.endPoint).pipe(map((data) => serializeAll(Recipe, data)));
    }

    public create(recipe: CreateRecipeData) {
        return this.apiService
            .post<CreateRecipeData, Recipe>(this.endPoint, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public getById(recipeId: string) {
        return this.apiService.get<Recipe>(`${this.endPoint}/${recipeId}`).pipe(map((data) => serialize(Recipe, data)));
    }

    public update(recipe: Recipe) {
        return this.apiService
            .put<Recipe>(`${this.endPoint}/${recipe.id}`, recipe)
            .pipe(map((response) => serialize(Recipe, response.body)));
    }

    public remove(recipeId: string) {
        return this.apiService.delete(`${this.endPoint}/${recipeId}`);
    }
}
