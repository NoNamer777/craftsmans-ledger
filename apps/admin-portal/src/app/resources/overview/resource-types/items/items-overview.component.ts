import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Item, ItemsService } from '@craftsmans-ledger/shared-ui';
import { switchMap, tap } from 'rxjs';
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
                switchMap(() => this.itemsService.remove(this.resourceService.resourceId())),
                switchMap(() => {
                    this.resourceService.resourceId.set(null);
                    this.actionsService.reset();

                    return this.itemsService.getAll();
                }),
                tap((items) => this.setItemOptions(items)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected onItemSelected(itemId: string) {
        this.selectedItem.set(itemId);
    }

    private setItemOptions(items: Item[]) {
        this.itemOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
    }
}
