import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item, ItemBuilder, ItemsService } from '@craftsmans-ledger/shared-ui';
import { debounceTime, of, switchMap, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { ResourceService } from '../../resource.service';
import { TEMP_ITEM } from './models';

@Component({
    selector: 'cml-item-form',
    templateUrl: './item.form.html',
    styleUrl: './item.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
})
export class ItemForm {
    protected readonly formBuilder = inject(FormBuilder);
    protected readonly itemsService = inject(ItemsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly resourceService = inject(ResourceService);
    private readonly actionsService = inject(ActionsService);

    protected readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>(null, [Validators.required, Validators.minLength(2)]),
        weight: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
        baseValue: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
    });

    protected readonly isLoading = signal(false);

    constructor() {
        toObservable(this.resourceService.resourceId)
            .pipe(
                switchMap((itemId) => {
                    if (itemId === TEMP_RESOURCE_ID) return of(TEMP_ITEM);
                    this.isLoading.set(true);
                    return this.itemsService.getById(itemId);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (item) => {
                    this.isLoading.set(false);
                    this.resourceService.resource.set(item);
                    this.populateForm();
                },
            });

        this.form.valueChanges
            .pipe(
                debounceTime(1000),
                tap(() => {
                    const formItem = this.createItemFromFormValue();
                    this.resourceService.updatedResource.set(formItem);
                    const hasChanged = !(this.resourceService.resource() as Item).compareTo(formItem);

                    if (this.actionsService.canSave() === hasChanged) return;
                    this.actionsService.canSave.set(hasChanged);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    private populateForm() {
        const { name, weight, baseValue } = this.resourceService.resource() as Item;

        this.form.reset({
            name: name,
            weight: weight,
            baseValue: baseValue,
        });
    }

    private createItemFromFormValue() {
        return new ItemBuilder(this.form.value).withId(this.resourceService.resourceId()).build();
    }
}
