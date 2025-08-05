import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationTypes, notifyError, Recipe, RecipesService } from '@craftsmans-ledger/shared-ui';
import { catchError, filter, map, of, tap } from 'rxjs';
import { SaveAction, SaveActions, TEMP_RESOURCE_ID } from '../../../models';
import { BaseResourceOverviewComponent } from '../base-resource-overview.component';
import { ResourcesListComponent } from '../components';
import { RecipeForm } from './recipe.form';

@Component({
    selector: 'cml-recipes-overview',
    templateUrl: './recipes-overview.component.html',
    styleUrl: './recipes-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourcesListComponent, RecipeForm],
})
export class RecipesOverviewComponent extends BaseResourceOverviewComponent {
    private readonly recipesService = inject(RecipesService);

    protected override getAllResources() {
        this.processing.set(true);
        return this.recipesService.getAll().pipe(tap((recipes) => this.setResourceOptions(recipes)));
    }

    protected override onNewResource() {
        this.resourceOptions.update((options) => [{ value: TEMP_RESOURCE_ID, label: 'New Recipe' }, ...options]);
        this.resourceService.resourceId.set(TEMP_RESOURCE_ID);
    }

    protected override onSaveResource(action: SaveAction) {
        if (action === SaveActions.CREATE) {
            return this.recipesService
                .create((this.resourceService.updatedResource() as Recipe).toCreateRecipeData())
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
                            title: 'Recipe created',
                            message: `Recipe with ID "${id}" was successfully created.`,
                        });
                    })
                );
        }
        return this.recipesService.update((this.resourceService.updatedResource() as Recipe).toUpdateRecipeData()).pipe(
            catchError((error: HttpErrorResponse) => {
                notifyError(error, this.notificationsService);
                this.actionsService.saving.set(false);
                return of(null);
            }),
            filter(Boolean),
            tap(({ id }) => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Recipe updated',
                    message: `Recipe with ID "${id}" was successfully updated.`,
                });
            })
        );
    }

    protected override onRemoveResource() {
        if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return of(null);
        return this.recipesService.remove(this.resourceService.resourceId()).pipe(
            map(() => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Recipe removed',
                    message: `Recipe with ID "${this.resourceService.resourceId()}" was successfully removed.`,
                });
                return true;
            })
        );
    }
}
