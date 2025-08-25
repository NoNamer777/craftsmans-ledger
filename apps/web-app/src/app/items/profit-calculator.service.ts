import { inject, Injectable } from '@angular/core';
import { ProfitCalculator, Recipe } from '@craftsmans-ledger/shared';
import { RecipesService } from '@craftsmans-ledger/shared-ui';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfitCalculatorService {
    private readonly recipesService = inject(RecipesService);
    private readonly profitCalculator = new ProfitCalculator();

    private _recipes: Recipe[];

    public get recipes() {
        return this._recipes;
    }

    public setRecipes() {
        return this.recipesService.getAll().pipe(
            tap((recipes) => {
                this._recipes = recipes;
                this.profitCalculator.setRecipes(recipes);
            })
        );
    }

    public calculateProfitForItem(itemId: string) {
        return this.profitCalculator.calculateProfitForItem(itemId);
    }
}
