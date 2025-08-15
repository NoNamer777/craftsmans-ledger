import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { serialize } from '@craftsmans-ledger/shared';
import { forkJoin, from, map, switchMap, tap } from 'rxjs';
import { BrowserStorageService, StorageKeys } from '../../browser-storage';
import { TechnologyTreesService } from '../../resources';
import { SidebarService } from '../../sidebar';
import { RecipeFilters, TechnologyTreeFilter } from './models';

@Component({
    selector: 'cml-recipe-filters',
    templateUrl: './recipe-filters.component.html',
    styleUrl: './recipe-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, ReactiveFormsModule],
})
export class RecipeFiltersComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly technologyTreesService = inject(TechnologyTreesService);
    private readonly sidebarService = inject(SidebarService<RecipeFilters>);
    private readonly browserStorageService = inject(BrowserStorageService);

    protected readonly form = this.formBuilder.group({
        technologyTreeId: this.formBuilder.control<string>(''),
        maxPoints: this.formBuilder.control<number>(0),
        technologyFilters: this.formBuilder.control<TechnologyTreeFilter[]>([]),
    });

    protected readonly canAddTechnologyFilter = computed(
        () =>
            this.addingTechnologyFilter() ||
            (this.formValue()?.maxPoints > 0 && this.formValue()?.technologyTreeId.trim())
    );

    protected readonly technologyTreeOptions = this.technologyTreesService
        .getAll()
        .pipe(map((technologyTrees) => technologyTrees.map(({ id, name }) => ({ label: name, value: id }))));

    protected get technologyTreeFilters() {
        return this.form.value.technologyFilters;
    }

    private readonly formValue = toSignal(this.form.valueChanges);

    private readonly addingTechnologyFilter = signal(false);

    public ngOnInit() {
        from(this.browserStorageService.getItem(StorageKeys.RECIPE_FILTERS))
            .pipe(
                switchMap((filters: RecipeFilters) =>
                    forkJoin([
                        ...filters.technologyFilters.map((filter) =>
                            this.addTechnologyFilter(filter.technologyTree.id, filter.maxPoints)
                        ),
                    ])
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected technologyTreeFilterAdded(technologyTreeId: string) {
        return this.form.value?.technologyFilters.some((filter) => filter.technologyTree.id === technologyTreeId);
    }

    protected onAddTechnologyFilter() {
        const { technologyTreeId, maxPoints } = this.form.value;
        this.addingTechnologyFilter.set(true);

        if (!technologyTreeId) return;
        this.addTechnologyFilter(technologyTreeId, maxPoints).subscribe();
    }

    protected onRemoveTechnologyFilter(technologyTreeId: string) {
        const technologyFilters = this.form.value.technologyFilters;

        this.form.controls.technologyFilters.setValue(
            technologyFilters.filter((filter) => filter.technologyTree.id !== technologyTreeId)
        );
    }

    protected onApplyFilters() {
        this.sidebarService.closeSidebar(
            serialize(RecipeFilters, {
                technologyFilters: this.form.value.technologyFilters,
            })
        );
    }

    private addTechnologyFilter(technologyTreeId: string, maxPoints: number) {
        return this.technologyTreesService.getById(technologyTreeId).pipe(
            tap((technologyTree) => {
                const technologyFilters = this.form.value.technologyFilters;

                this.form.controls.technologyFilters.setValue([
                    ...technologyFilters,
                    serialize(TechnologyTreeFilter, { technologyTree: technologyTree, maxPoints: maxPoints }),
                ]);

                this.form.controls.technologyTreeId.reset();
                this.form.controls.maxPoints.reset();
                this.addingTechnologyFilter.set(false);
            }),
            takeUntilDestroyed(this.destroyRef)
        );
    }
}
