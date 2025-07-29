import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'cml-item-form',
    templateUrl: './item.form.html',
    styleUrl: './item.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ItemForm {
    public readonly itemId = input.required<string>();
}
