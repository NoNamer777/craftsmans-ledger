import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    CreateTechnologyTreeData,
    NotificationTypes,
    notifyError,
    TechnologyTree,
    TechnologyTreesService,
    transform,
} from '@craftsmans-ledger/shared-ui';
import { catchError, filter, map, of, tap } from 'rxjs';
import { SaveAction, SaveActions, TEMP_RESOURCE_ID } from '../../../models';
import { BaseResourceOverviewComponent } from '../base-resource-overview.component';
import { ResourcesListComponent } from '../components';
import { TechnologyTreeForm } from './technology-tree.form';

@Component({
    selector: 'cml-technology-trees-overview',
    templateUrl: './technology-tree-overview.component.html',
    styleUrl: './technology-tree-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesListComponent, TechnologyTreeForm],
})
export class TechnologyTreeOverviewComponent extends BaseResourceOverviewComponent {
    private readonly technologyTreesService = inject(TechnologyTreesService);

    protected override getAllResources() {
        this.processing.set(true);
        return this.technologyTreesService
            .getAll()
            .pipe(tap((technologyTrees) => this.setResourceOptions(technologyTrees)));
    }

    protected override onNewResource() {
        this.resourceOptions.update((options) => [
            { value: TEMP_RESOURCE_ID, label: 'New Technology Tree' },
            ...options,
        ]);
        this.resourceService.resourceId.set(TEMP_RESOURCE_ID);
    }

    protected override onSaveResource(action: SaveAction) {
        if (action === SaveActions.CREATE) {
            return this.technologyTreesService
                .create(transform(CreateTechnologyTreeData, this.resourceService.updatedResource()))
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
                            title: 'Technology Tree created',
                            message: `Technology Tree with ID "${id}" was successfully created.`,
                        });
                    })
                );
        }
        return this.technologyTreesService.update(this.resourceService.updatedResource() as TechnologyTree).pipe(
            catchError((error: HttpErrorResponse) => {
                notifyError(error, this.notificationsService);
                this.actionsService.saving.set(false);
                return of(null);
            }),
            filter(Boolean),
            tap(({ id }) => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Technology Tree updated',
                    message: `Technology Tree with ID "${id}" was successfully updated.`,
                });
            })
        );
    }

    protected override onRemoveResource() {
        if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return of(null);
        return this.technologyTreesService.remove(this.resourceService.resourceId()).pipe(
            map(() => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Technology Tree removed',
                    message: `Technology Tree with ID "${this.resourceService.resourceId()}" was successfully removed.`,
                });
                return true;
            })
        );
    }
}
