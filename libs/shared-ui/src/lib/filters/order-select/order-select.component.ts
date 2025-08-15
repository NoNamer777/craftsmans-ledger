import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArrowDownWideShortIconComponent, ArrowUpWideShortIconComponent } from '../../icons';
import { SortOrder, SortOrders } from '../../resources';
import { OrderButtonComponent } from './order-button.component';

@Component({
    selector: 'cml-order-select',
    templateUrl: './order-select.component.html',
    styleUrl: './order-select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OrderButtonComponent, ArrowDownWideShortIconComponent, ArrowUpWideShortIconComponent],
})
export class OrderSelectComponent {
    protected readonly SortOrders = SortOrders;

    public readonly selectedOrder = signal<SortOrder>(SortOrders.ASCENDING);

    protected onSortOrderSelected(order: SortOrder) {
        this.selectedOrder.set(order);
    }
}
