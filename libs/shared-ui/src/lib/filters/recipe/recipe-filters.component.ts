import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { TechnologyTreesService } from '../../resources';
import { SidebarService } from '../../sidebar';
import { serialize } from '../../utils';
import { RecipeFilters, TechnologyTreeFilter } from './models';

@Component({
    selector: 'cml-recipe-filters',
    templateUrl: './recipe-filters.component.html',
    styleUrl: './recipe-filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, ReactiveFormsModule],
})
export class RecipeFiltersComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly technologyTreesService = inject(TechnologyTreesService);
    private readonly sidebarService = inject(SidebarService<RecipeFilters>);

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

    protected technologyTreeFilterAdded(technologyTreeId: string) {
        return this.form.value?.technologyFilters.some((filter) => filter.technologyTree.id === technologyTreeId);
    }

    protected readonly technologyTreeOptions = this.technologyTreesService
        .getAll()
        .pipe(map((technologyTrees) => technologyTrees.map(({ id, name }) => ({ label: name, value: id }))));

    protected get technologyTreeFilters() {
        return this.form.value.technologyFilters;
    }

    private readonly formValue = toSignal(this.form.valueChanges);

    private readonly addingTechnologyFilter = signal(false);

    protected onAddTechnologyFilter() {
        const { technologyTreeId, maxPoints } = this.form.value;
        this.addingTechnologyFilter.set(true);

        if (!technologyTreeId) return;
        this.technologyTreesService
            .getById(technologyTreeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (technologyTree) => {
                    const technologyFilters = this.form.value.technologyFilters;

                    this.form.controls.technologyFilters.setValue([
                        ...technologyFilters,
                        serialize(TechnologyTreeFilter, { technologyTree: technologyTree, maxPoints: maxPoints }),
                    ]);

                    this.form.controls.technologyTreeId.reset();
                    this.form.controls.maxPoints.reset();
                    this.addingTechnologyFilter.set(false);
                },
            });
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
}
