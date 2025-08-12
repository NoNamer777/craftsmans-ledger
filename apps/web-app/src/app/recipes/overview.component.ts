import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipesService } from '@craftsmans-ledger/shared-ui';
import { RecipeCardComponent } from './recipe-card.component';

@Component({
    selector: 'cml-recipes-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, RecipeCardComponent],
})
export class OverviewComponent {
    protected readonly recipesService = inject(RecipesService);
}
