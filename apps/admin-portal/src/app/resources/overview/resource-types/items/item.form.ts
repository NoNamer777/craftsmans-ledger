import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item, ItemBuilder } from '@craftsmans-ledger/shared';
import { ItemsService } from '@craftsmans-ledger/shared-ui';
import { debounceTime, of, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { BaseResourceFormComponent } from '../base-resource-form.component';
import { TEMP_ITEM } from './models';

@Component({
    selector: 'cml-item-form',
    templateUrl: './item.form.html',
    styleUrl: './item.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
})
export class ItemForm extends BaseResourceFormComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly actionsService = inject(ActionsService);
    protected readonly itemsService = inject(ItemsService);

    protected override readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>(null, [Validators.required, Validators.minLength(2)]),
        weight: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
        cost: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
    });

    constructor() {
        super();

        this.form.valueChanges
            .pipe(
                debounceTime(1000),
                tap(() => this.onFormChange()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected override getResource(resourceId: string) {
        if (resourceId === TEMP_RESOURCE_ID) return of(TEMP_ITEM);
        this.isLoading.set(true);
        return this.itemsService.getById(resourceId);
    }

    protected override populateForm() {
        const { name, weight, cost } = this.resourceService.resource() as Item;

        this.form.reset({
            name: name,
            weight: weight,
            cost: cost,
        });
    }

    protected override onFormChange() {
        const formItem = this.createItemFromFormValue();
        this.resourceService.updatedResource.set(formItem);

        const hasChanged = !(this.resourceService.resource() as Item).compareTo(formItem);

        if (this.actionsService.canSave() === hasChanged) return;
        this.actionsService.canSave.set(hasChanged);
    }

    private createItemFromFormValue() {
        return new ItemBuilder(this.form.value).withId(this.resourceService.resourceId()).build();
    }
}
