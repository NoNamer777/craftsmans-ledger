import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ItemsService } from '@craftsmans-ledger/shared-ui';
import { ResourcesList } from '../resources-list';
import { ResourceOption } from '../resources-list/models';
import { ItemForm } from './item.form';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesList, ItemForm],
})
export class ItemsOverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly itemsService = inject(ItemsService);

    protected readonly itemOptions = signal<ResourceOption[]>([]);

    protected readonly selectedItem = signal<string>(null);

    protected readonly hasItemSelected = computed(() => Boolean(this.selectedItem()));

    public ngOnInit() {
        this.itemsService
            .getAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (items) => {
                    this.itemOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
                },
            });
    }

    protected onItemSelected(itemId: string) {
        this.selectedItem.set(itemId);
    }
}
