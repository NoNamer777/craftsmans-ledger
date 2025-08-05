import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService, notifyError, Resource } from '@craftsmans-ledger/shared-ui';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { SaveAction, TEMP_RESOURCE_ID } from '../../models';
import { ActionsService } from '../actions.service';
import { ResourceService } from '../resource.service';
import { ResourceOption } from './components';

@Component({
    selector: 'cml-base-resource-overview',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export abstract class BaseResourceOverviewComponent implements OnInit {
    protected readonly destroyRef = inject(DestroyRef);
    protected readonly resourceService = inject(ResourceService);
    protected readonly actionsService = inject(ActionsService);
    protected readonly notificationsService = inject(NotificationService);

    protected readonly resourceOptions = signal<ResourceOption[]>([]);

    protected readonly processing = signal(false);

    protected readonly hasResourceSelected = computed(() => Boolean(this.resourceService.resourceId()));

    public ngOnInit() {
        this.getAllResources().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();

        this.actionsService.newResource$
            .pipe(
                tap(() => this.onNewResource()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.actionsService.removeResource$
            .pipe(
                switchMap(() => this.onRemoveResource()),
                catchError((error) => {
                    notifyError(error, this.notificationsService);
                    this.actionsService.removing.set(false);
                    return of(null);
                }),
                filter(Boolean),
                switchMap(() => {
                    this.resourceService.resourceId.set(null);
                    this.actionsService.reset();

                    this.processing.set(true);
                    return this.getAllResources();
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.actionsService.saveResource$
            .pipe(
                switchMap((action) => this.onSaveResource(action)),
                switchMap((resource) => {
                    this.actionsService.reset();
                    this.resourceService.resourceId.set(resource.id);

                    this.resourceService.resource.set(resource);
                    this.resourceService.updatedResource.set(resource);

                    this.processing.set(true);
                    return this.getAllResources();
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected onChangeSelectedResource() {
        if (this.resourceService.resourceId() !== TEMP_RESOURCE_ID) return;
        this.resourceOptions.update((options) => options.filter(({ value }) => value !== TEMP_RESOURCE_ID));
    }

    protected setResourceOptions(resources: Resource[]) {
        this.resourceOptions.set(resources.map((resource) => ({ label: resource.label(), value: resource.id })));
        this.processing.set(false);
    }

    protected abstract getAllResources(): Observable<Resource[]>;

    protected abstract onNewResource(): void;

    protected abstract onSaveResource(action: SaveAction): Observable<Resource>;

    protected abstract onRemoveResource(): Observable<boolean>;
}
