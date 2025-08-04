import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-recipes-overview',
    templateUrl: './recipes-overview.component.html',
    styleUrl: './recipes-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class RecipesOverviewComponent {}
