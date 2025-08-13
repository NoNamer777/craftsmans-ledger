import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FilterButtonComponent,
    log,
    RecipeFiltersComponent,
    RecipesService,
    SidebarComponent,
    SidebarService,
} from '@craftsmans-ledger/shared-ui';
import { RecipeCardComponent } from './recipe-card.component';

@Component({
    selector: 'cml-recipes-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, RecipeCardComponent, FilterButtonComponent, SidebarComponent],
})
export class OverviewComponent implements OnInit {
    protected readonly recipesService = inject(RecipesService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly sidebarService = inject(SidebarService);

    public ngOnInit() {
        this.sidebarService.title.set('Recipe Filters');
        this.sidebarService.component.set(RecipeFiltersComponent);

        this.sidebarService.close$
            .pipe(
                log((result) => ({ result })),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
