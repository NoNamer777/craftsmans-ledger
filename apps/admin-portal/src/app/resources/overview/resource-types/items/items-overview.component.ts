import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ItemsService } from '@craftsmans-ledger/shared-ui';
import { ResourcesList } from '../resources-list';
import { ResourceOption } from '../resources-list/models';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesList],
})
export class ItemsOverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly itemsService = inject(ItemsService);

    protected readonly resourceOptions = signal<ResourceOption[]>([]);

    public ngOnInit() {
        this.itemsService
            .getAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (items) => {
                    this.resourceOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
                },
            });
    }
}
