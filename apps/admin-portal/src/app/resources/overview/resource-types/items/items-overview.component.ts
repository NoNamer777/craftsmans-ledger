import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Item, ItemsService } from '@craftsmans-ledger/shared-ui';
import { of, switchMap, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { ResourceService } from '../../resource.service';
import { ResourceOption, ResourcesListComponent } from '../components';
import { ItemForm } from './item.form';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesListComponent, ItemForm, FormsModule],
})
export class ItemsOverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly resourceService = inject(ResourceService);
    private readonly actionsService = inject(ActionsService);
    private readonly itemsService = inject(ItemsService);

    protected readonly itemOptions = signal<ResourceOption[]>([]);

    protected readonly hasItemSelected = computed(() => Boolean(this.resourceService.resourceId()));

    public ngOnInit() {
        this.itemsService
            .getAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (items) => this.setItemOptions(items),
            });

        this.actionsService.removeResource$
            .pipe(
                switchMap(() => {
                    if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return of(null);
                    return this.itemsService.remove(this.resourceService.resourceId());
                }),
                switchMap(() => {
                    this.resourceService.resourceId.set(null);
                    this.actionsService.reset();

                    return this.itemsService.getAll();
                }),
                tap((items) => this.setItemOptions(items)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.actionsService.newResource$
            .pipe(
                tap(() => {
                    this.itemOptions.update((options) => [{ value: TEMP_RESOURCE_ID, label: 'New Item' }, ...options]);
                    this.resourceService.resourceId.set(TEMP_RESOURCE_ID);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected onChangeSelectedResource() {
        if (this.resourceService.resourceId() !== TEMP_RESOURCE_ID) return;
        this.itemOptions.update((options) => options.filter(({ value }) => value !== TEMP_RESOURCE_ID));
    }

    private setItemOptions(items: Item[]) {
        this.itemOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
    }
}
