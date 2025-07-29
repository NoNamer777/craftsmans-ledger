import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item, ItemsService, sha512 } from '@craftsmans-ledger/shared-ui';
import { from, switchMap } from 'rxjs';

@Component({
    selector: 'cml-item-form',
    templateUrl: './item.form.html',
    styleUrl: './item.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
})
export class ItemForm {
    private readonly destroyRef = inject(DestroyRef);
    protected readonly formBuilder = inject(FormBuilder);
    protected readonly itemsService = inject(ItemsService);

    public readonly itemId = input.required<string>();

    protected readonly item = signal<Item>(null);

    protected readonly itemHash = toObservable(this.item).pipe(
        switchMap((item) => from(sha512(item))),
        takeUntilDestroyed(this.destroyRef)
    );

    protected readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>(null, [Validators.required, Validators.minLength(2)]),
        weight: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
        baseValue: this.formBuilder.control<number>(null, [Validators.required, Validators.min(0)]),
    });

    constructor() {
        toObservable(this.itemId)
            .pipe(
                switchMap((itemId) => this.itemsService.getById(itemId)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (item) => {
                    this.item.set(item);
                    this.populateForm();
                },
            });
    }

    private populateForm() {
        const { name, weight, baseValue } = this.item();

        this.form.reset({
            name: name,
            weight: weight,
            baseValue: baseValue,
        });
    }
}
