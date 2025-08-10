import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
    NotificationTypes,
    notifyError,
    Recipe,
    RecipeDto,
    RecipesService,
    Resource,
} from '@craftsmans-ledger/shared-ui';
import { catchError, filter, forkJoin, iif, map, of, switchMap, tap } from 'rxjs';
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
        const recipeData = this.resourceService.updatedResource() as RecipeDto;
        const oldRecipeData = this.resourceService.resource() as RecipeDto;

        if (action === SaveActions.CREATE) {
            return this.recipesService.create(recipeData.toCreateRecipeData()).pipe(
                catchError((error: HttpErrorResponse) => {
                    notifyError(error, this.notificationsService);
                    this.actionsService.saving.set(false);
                    return of(null);
                }),
                filter(Boolean),
                switchMap((recipe) =>
                    forkJoin([
                        ...recipeData.inputs.map((dto) => this.recipesService.addInputToRecipe(recipe.id, dto)),
                        ...recipeData.outputs.map((dto) => this.recipesService.addOutputToRecipe(recipe.id, dto)),
                    ]).pipe(map(() => recipe))
                ),
                tap((recipe) => {
                    this.notificationsService.addNotification({
                        type: NotificationTypes.SUCCESS,
                        title: 'Recipe created',
                        message: `Recipe with ID "${recipe.id}" was successfully created.`,
                    });
                })
            );
        }
        return this.recipesService.update(recipeData.toUpdateRecipeData()).pipe(
            catchError((error: HttpErrorResponse) => {
                notifyError(error, this.notificationsService);
                this.actionsService.saving.set(false);
                return of(null);
            }),
            filter(Boolean),
            switchMap((recipe) => {
                const inputsToUpdate = recipeData.inputs.filter((currentDto) => {
                    const oldDto = oldRecipeData.inputs.find((dto) => dto.itemId === currentDto.itemId);
                    return !oldDto.compareTo(currentDto);
                });
                const outputsToUpdate = recipeData.outputs.filter((currentDto) => {
                    const oldDto = oldRecipeData.outputs.find((dto) => dto.itemId === currentDto.itemId);
                    return !oldDto.compareTo(currentDto);
                });

                return iif(
                    () => inputsToUpdate.length === 0 && outputsToUpdate.length === 0,
                    of(null),
                    forkJoin([
                        ...inputsToUpdate.map((dto) => this.recipesService.updateRecipeInput(recipe.id, dto)),
                        ...outputsToUpdate.map((dto) => this.recipesService.updateRecipeOutput(recipe.id, dto)),
                    ])
                ).pipe(map(() => recipe));
            }),
            tap(({ id }) => {
                this.notificationsService.addNotification({
                    type: NotificationTypes.SUCCESS,
                    title: 'Recipe updated',
                    message: `Recipe with ID "${id}" was successfully updated.`,
                });
            })
        );
    }

    protected override onResourceSaved(resource: Resource) {
        this.actionsService.reset();
        this.resourceService.resourceId.set(resource.id);

        this.resourceService.resource.set((resource as Recipe).toDto());
        this.resourceService.updatedResource.set((resource as Recipe).toDto());

        this.processing.set(true);
        return this.getAllResources();
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
