import { DestroyRef, EnvironmentInjector, FactoryProvider, inject, runInInjectionContext } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { serialize } from '@craftsmans-ledger/shared';
import { RecipeBuilder, RecipeDto, RecipeItemDto, RecipesService } from '@craftsmans-ledger/shared-ui';
import { filter, iif, merge, of, pairwise, startWith, switchMap, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ResourceService } from '../../resource.service';
import { TEMP_TECHNOLOGY_TREE } from '../technology-trees/models';

export type RecipeItemDtoForm = FormGroup<{
    itemId: FormControl<string>;
    quantity: FormControl<number>;
}>;

export const TEMP_RECIPE = new RecipeBuilder()
    .withId(TEMP_RESOURCE_ID)
    .withTechnologyTree(TEMP_TECHNOLOGY_TREE)
    .build()
    .toDto();

export function addRecipeItem(injector: EnvironmentInjector, type: string, value?: RecipeItemDto) {
    return runInInjectionContext(injector, () => {
        const formBuilder = inject(FormBuilder);
        const destroyRef = inject(DestroyRef);
        const resourceService = inject(ResourceService);
        const recipesService = inject(RecipesService);

        const formGroup = formBuilder.group({
            itemId: formBuilder.control(value?.itemId ?? '', [Validators.required]),
            quantity: formBuilder.control(value?.quantity ?? 1, [Validators.required, Validators.min(1)]),
        });

        formGroup.controls.itemId.valueChanges
            .pipe(
                startWith(formGroup.value.itemId),
                filter((itemId) => itemId !== null && resourceService.resourceId() !== TEMP_RESOURCE_ID),
                pairwise(),
                switchMap(([curr, next]) =>
                    merge(
                        iif(
                            () => Boolean(curr),
                            recipesService[type === 'input' ? 'removeInputFromRecipe' : 'removeOutputFromRecipe'](
                                resourceService.resourceId(),
                                curr
                            ).pipe(
                                tap(() => {
                                    const resource = resourceService.resource() as RecipeDto;

                                    const removedRecipeItem = resource[type === 'input' ? 'inputs' : 'outputs'].find(
                                        ({ itemId }) => itemId === curr
                                    );
                                    const indexOf =
                                        resource[type === 'input' ? 'inputs' : 'outputs'].indexOf(removedRecipeItem);

                                    resource[type === 'input' ? 'inputs' : 'outputs'].splice(indexOf, 1);

                                    resourceService.resource.set(resource);
                                    resourceService.updatedResource.set(resource);
                                })
                            ),
                            of(curr)
                        ),
                        of(formGroup.value.quantity).pipe(
                            switchMap((quantity) =>
                                recipesService[type === 'input' ? 'addInputToRecipe' : 'addOutputToRecipe'](
                                    resourceService.resourceId(),
                                    serialize(RecipeItemDto, { itemId: next, quantity: quantity })
                                )
                            ),
                            tap((recipeItem) => {
                                const resource = resourceService.resource() as RecipeDto;

                                resource[type === 'input' ? 'inputs' : 'outputs'].push(recipeItem.toDto());
                                resourceService.resource.set(resource);
                                resourceService.updatedResource.set(resource);
                            })
                        )
                    )
                ),
                takeUntilDestroyed(destroyRef)
            )
            .subscribe();

        return formGroup;
    });
}

export function provideControlContainer(): FactoryProvider {
    return {
        provide: ControlContainer,
        useFactory: () => inject(ControlContainer, { skipSelf: true }),
    };
}
