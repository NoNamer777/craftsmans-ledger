import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import {
    ChevronDownIconComponent,
    ChevronUpIconComponent,
    CoinsIconComponent,
    Recipe,
    RecipesService,
    StopwatchIconComponent,
    WeightHangingIconComponent,
} from '@craftsmans-ledger/shared-ui';

@Component({
    selector: 'cml-recipe-card',
    templateUrl: './recipe-card.component.html',
    styleUrl: './recipe-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ChevronDownIconComponent,
        ChevronUpIconComponent,
        CoinsIconComponent,
        StopwatchIconComponent,
        WeightHangingIconComponent,
        AsyncPipe,
    ],
})
export class RecipeCardComponent {
    protected readonly recipesService = inject(RecipesService);

    public readonly recipe = input.required<Recipe>();

    public readonly index = input.required<number>();

    protected readonly toggled = signal(false);

    protected onToggle() {
        this.toggled.update((toggled) => !toggled);
    }
}
