import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginatedResponse, Recipe } from '@craftsmans-ledger/shared';
import {
    BrowserStorageService,
    FilterButtonComponent,
    RecipeFilters,
    RecipeFiltersComponent,
    RecipesService,
    SidebarComponent,
    SidebarService,
    StorageKeys,
} from '@craftsmans-ledger/shared-ui';
import { filter, map, merge, tap } from 'rxjs';
import { PaginationComponent, PaginationService } from './pagination';
import { RecipeCardComponent } from './recipe-card.component';

@Component({
    selector: 'cml-recipes-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, RecipeCardComponent, FilterButtonComponent, SidebarComponent, PaginationComponent],
})
export class OverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly recipesService = inject(RecipesService);
    private readonly sidebarService = inject(SidebarService<RecipeFilters>);
    private readonly browserStorageService = inject(BrowserStorageService);
    private readonly paginationService = inject(PaginationService);

    protected recipes$ = this.recipesService
        .query()
        .pipe(tap((paginatedResponse) => this.setCurrentPages(paginatedResponse)));

    private readonly page$ = this.paginationService.page$.pipe(
        map((page) => ({
            offset: (page - 1) * 20,
        }))
    );

    public ngOnInit() {
        this.sidebarService.title.set('Recipe Filters');
        this.sidebarService.component.set(RecipeFiltersComponent);

        merge(this.sidebarService.close$, this.page$)
            .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (filters) => {
                    this.browserStorageService.setItem(StorageKeys.RECIPE_FILTERS, filters);
                    this.recipes$ = this.recipesService
                        .query(filters)
                        .pipe(tap((paginatedResponse) => this.setCurrentPages(paginatedResponse)));
                },
            });
    }

    private setCurrentPages(paginatedResponse: PaginatedResponse<Recipe>) {
        this.paginationService.page.set(paginatedResponse.page);
        this.paginationService.lastPage.set(paginatedResponse.lastPage);
        this.paginationService.count.set(paginatedResponse.count);
    }
}
