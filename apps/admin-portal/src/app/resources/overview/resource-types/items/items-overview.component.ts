import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CreateItemData,
    Item,
    ItemsService,
    NotificationTypes,
    notifyError,
    Resource,
    transform,
} from '@craftsmans-ledger/shared-ui';
import { catchError, filter, map, of, tap } from 'rxjs';
import { SaveAction, SaveActions, TEMP_RESOURCE_ID } from '../../../models';
import { BaseResourceOverviewComponent } from '../base-resource-overview.component';
import { ResourcesListComponent } from '../components';
import { ItemForm } from './item.form';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesListComponent, ItemForm, FormsModule],
})
export class ItemsOverviewComponent extends BaseResourceOverviewComponent {
    private readonly itemsService = inject(ItemsService);

    protected onChangeSelectedResource() {
        if (this.resourceService.resourceId() !== TEMP_RESOURCE_ID) return;
        this.resourceOptions.update((options) => options.filter(({ value }) => value !== TEMP_RESOURCE_ID));
    }

    protected override getAllResources() {
        this.processing.set(true);

        return this.itemsService.getAll().pipe(tap((items) => this.setResourceOptions(items)));
    }

    private setResourceOptions(items: Resource[]) {
        this.resourceOptions.set(items.map(({ id, name }) => ({ label: name, value: id })));
        this.processing.set(false);
    }

    protected override onNewResource() {
        this.resourceOptions.update((options) => [{ value: TEMP_RESOURCE_ID, label: 'New Item' }, ...options]);
        this.resourceService.resourceId.set(TEMP_RESOURCE_ID);
    }

    protected override onSaveResource(action: SaveAction) {
        if (action === SaveActions.CREATE) {
            return this.itemsService.create(transform(CreateItemData, this.resourceService.updatedResource())).pipe(
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
                    title: 'Item updated',
                    message: `Item with ID "${id}" was successfully updated.`,
                });
            })
        );
    }

    protected override onRemoveResource() {
        if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return of(null);
        return this.itemsService.remove(this.resourceService.resourceId()).pipe(
            map(() => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Item removed',
                    message: `Item with ID "${this.resourceService.resourceId()}" was successfully removed.`,
                });
                return true;
            })
        );
    }
}
