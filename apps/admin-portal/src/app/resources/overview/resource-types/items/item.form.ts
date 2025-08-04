import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item, ItemBuilder, ItemsService, Resource } from '@craftsmans-ledger/shared-ui';
import { debounceTime, Observable, of, tap } from 'rxjs';
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
    protected readonly formBuilder = inject(FormBuilder);
    protected readonly itemsService = inject(ItemsService);
    private readonly actionsService = inject(ActionsService);

    protected override readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>(null, [Validators.required, Validators.minLength(2)]),
        weight: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
        baseValue: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
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

    protected override getResource(resourceId: string): Observable<Resource> {
        if (resourceId === TEMP_RESOURCE_ID) return of(TEMP_ITEM);
        this.isLoading.set(true);
        return this.itemsService.getById(resourceId);
    }

    protected override populateForm() {
        const { name, weight, baseValue } = this.resourceService.resource() as Item;

        this.form.reset({
            name: name,
            weight: weight,
            baseValue: baseValue,
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
