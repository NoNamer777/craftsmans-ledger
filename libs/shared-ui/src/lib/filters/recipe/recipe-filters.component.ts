import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-recipe-filters',
    templateUrl: './recipe-filters.component.html',
    styleUrl: './recipe-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class RecipeFiltersComponent {}
