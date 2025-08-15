import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SortOrder } from '@craftsmans-ledger/shared-ui';

@Component({
    selector: 'cml-order-button',
    templateUrl: './order-button.component.html',
    styleUrl: './order-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class OrderButtonComponent {
    public readonly sortOrder = input.required<SortOrder>();

    public readonly isActive = input(false);

    public readonly selected = output<SortOrder>();

    protected onSelectSortOrder() {
        if (this.isActive()) return;
        this.selected.emit(this.sortOrder());
    }
}
