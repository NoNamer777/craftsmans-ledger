import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { Resource } from '@craftsmans-ledger/shared';
import { Observable, switchMap } from 'rxjs';
import { ResourceService } from '../resource.service';

@Component({
    selector: 'cml-base-resource-form',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export abstract class BaseResourceFormComponent {
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly resourceService = inject(ResourceService);

    protected readonly form: FormGroup;

    protected readonly isLoading = signal(false);

    protected constructor() {
        toObservable(this.resourceService.resourceId)
            .pipe(
                switchMap((resourceId) => this.getResource(resourceId)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (resource) => {
                    this.isLoading.set(false);
                    this.resourceService.resource.set(resource);
                    this.populateForm();
                },
            });
    }

    protected abstract getResource(resourceId: string): Observable<Resource>;

    protected abstract populateForm(): void;

    protected abstract onFormChange(): void;
}
