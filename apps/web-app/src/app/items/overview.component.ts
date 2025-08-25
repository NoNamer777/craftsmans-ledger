import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    BrowserStorageService,
    FilterButtonComponent,
    ItemsService,
    RecipeFilters,
    RecipeFiltersComponent,
    SidebarComponent,
    SidebarService,
    StorageKeys,
} from '@craftsmans-ledger/shared-ui';
import { combineLatest, debounceTime, filter, from, map, merge, startWith, switchMap, tap } from 'rxjs';
import { ItemCardComponent } from './item-card.component';
import { PaginationComponent, PaginationService } from './pagination';
import { ProfitCalculatorService } from './profit-calculator.service';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ItemCardComponent, FilterButtonComponent, SidebarComponent, PaginationComponent],
})
export class ItemsOverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly itemsService = inject(ItemsService);
    private readonly paginationService = inject(PaginationService);
    private readonly profitCalculatorService = inject(ProfitCalculatorService);
    private readonly sidebarService = inject(SidebarService<RecipeFilters>);
    private readonly browserStorageService = inject(BrowserStorageService);

    private readonly offset = this.paginationService.page$.pipe(
        startWith(this.paginationService.page()),
        map((page) => {
            if (page === 0) return undefined;
            return { offset: (page - 1) * 20 };
        })
    );

    private readonly filters = merge(
        from(this.browserStorageService.getItem(StorageKeys.ITEM_FILTERS)).pipe(
            map((filters: RecipeFilters) => {
                if (filters) return { ...filters };
                return {};
            })
        ),
        this.sidebarService.close$.pipe(
            filter(Boolean),
            tap(() => this.paginationService.fetchPage(1)),
            map((filters) => ({ ...filters }))
        )
    );

    protected readonly items = toSignal(
        combineLatest([this.offset, this.filters]).pipe(
            debounceTime(100),
            map(([offset, filters]) => ({ ...filters, ...offset })),
            tap((filters) => {
                this.browserStorageService.setItem(StorageKeys.ITEM_FILTERS, filters);
            }),
            map((filters: RecipeFilters) => {
                const params = {
                    offset: filters.offset,
                    limit: filters.limit,
                    order: filters.order,
                    techTreeIds: [] as string[],
                    maxTechPoints: [] as number[],
                };

                if (filters.technologyFilters) {
                    params.techTreeIds = filters.technologyFilters.map((filter) => filter.technologyTree.id);
                    params.maxTechPoints = filters.technologyFilters.map((filter) => filter.maxPoints);
                }
                return params;
            }),
            switchMap((params) => this.itemsService.query(params)),
            tap((response) => {
                this.paginationService.count.set(response.count);
                this.paginationService.page.set(response.page);
                this.paginationService.lastPage.set(response.lastPage);
            }),
            map((response) => response.data)
        )
    );

    public ngOnInit() {
        this.sidebarService.title.set('Item Filters');
        this.sidebarService.component.set(RecipeFiltersComponent);

        this.profitCalculatorService.setRecipes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
}
