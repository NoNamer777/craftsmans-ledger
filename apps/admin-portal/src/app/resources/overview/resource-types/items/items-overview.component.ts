import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
    CreateItemData,
    Item,
    ItemsService,
    NotificationService,
    NotificationTypes,
} from '@craftsmans-ledger/shared-ui';
import { plainToInstance } from 'class-transformer';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { notifyError } from '../../../../core/error-handling/functions';
import { SaveActions, TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { ResourceService } from '../../resource.service';
import { ResourceOption, ResourcesListComponent } from '../components';
import { ItemForm } from './item.form';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesListComponent, ItemForm, FormsModule],
})
export class ItemsOverviewComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly resourceService = inject(ResourceService);
    private readonly actionsService = inject(ActionsService);
    private readonly itemsService = inject(ItemsService);
    private readonly notificationsService = inject(NotificationService);

    protected readonly itemOptions = signal<ResourceOption[]>([]);

    protected readonly processing = signal(false);

    protected readonly hasItemSelected = computed(() => Boolean(this.resourceService.resourceId()));

    public ngOnInit() {
        this.processing.set(true);

        this.itemsService
            .getAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (items) => this.setItemOptions(items),
            });

        this.actionsService.removeResource$
            .pipe(
                switchMap(() => {
                    if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return of(null);
                    return this.itemsService.remove(this.resourceService.resourceId()).pipe(map(() => true));
                }),
                catchError((error) => {
                    notifyError(error, this.notificationsService);
                    this.actionsService.removing.set(false);
                    return of(null);
                }),
                filter(Boolean),
                switchMap(() => {
                    this.notificationsService.addNotification({
                        type: NotificationTypes.SUCCESS,
                        title: 'Item removed',
                        message: `Item with ID "${this.resourceService.resourceId()}" was successfully removed.`,
                    });

                    this.resourceService.resourceId.set(null);
                    this.actionsService.reset();

                    this.processing.set(true);
                    return this.itemsService.getAll();
                }),
                tap((items) => this.setItemOptions(items)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.actionsService.newResource$
            .pipe(
                tap(() => {
                    this.itemOptions.update((options) => [{ value: TEMP_RESOURCE_ID, label: 'New Item' }, ...options]);
                    this.resourceService.resourceId.set(TEMP_RESOURCE_ID);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();

        this.actionsService.saveResource$
            .pipe(
                switchMap((action) => {
                    if (action === SaveActions.CREATE) {
                        return this.itemsService
                            .create(plainToInstance(CreateItemData, this.resourceService.updatedResource()))
                            .pipe(
                                catchError((error: HttpErrorResponse) => {
                                    notifyError(error, this.notificationsService);
                                    this.actionsService.saving.set(false);
                                    return of(null);
                                }),
                                filter(Boolean),
                                tap(({ id }) => {
                                    this.notificationsService.addNotification({
                                        type: NotificationTypes.SUCCESS,
                                        title: 'Item created',
                                        message: `Item with ID "${id}" was successfully created.`,
                                    });
                                })
                            );
                    }
                    return this.itemsService.update(this.resourceService.updatedResource() as Item).pipe(
                        catchError((error: HttpErrorResponse) => {
                            notifyError(error, this.notificationsService);
                            this.actionsService.saving.set(false);
                            return of(null);
                        }),
                        filter(Boolean),
                        tap(({ id }) => {
                            this.notificationsService.addNotification({
                                type: NotificationTypes.SUCCESS,
                                title: 'Item created',
                                message: `Item with ID "${id}" was successfully updated.`,
                            });
                        })
                    );
                }),
                switchMap((item) => {
                    this.actionsService.reset();
                    this.resourceService.resourceId.set(item.id);

                    this.resourceService.resource.set(item);
                    this.resourceService.updatedResource.set(item);

                    this.processing.set(true);
                    return this.itemsService.getAll();
                }),
                tap((items) => this.setItemOptions(items)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected onChangeSelectedResource() {
        if (this.resourceService.resourceId() !== TEMP_RESOURCE_ID) return;
        this.itemOptions.update((options) => options.filter(({ value }) => value !== TEMP_RESOURCE_ID));
    }

    private setItemOptions(items: Item[]) {
        this.itemOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
        this.processing.set(false);
    }
}
