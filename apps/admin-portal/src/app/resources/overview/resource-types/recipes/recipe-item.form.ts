import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EnvironmentInjector,
    inject,
    input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormArray, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { RecipeDto } from '@craftsmans-ledger/shared';
import { ItemsService, RecipesService } from '@craftsmans-ledger/shared-ui';
import { map, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ResourceService } from '../../resource.service';
import { ElementIdPipe } from './element-id-pipe';
import { addRecipeItem, provideControlContainer, RecipeItemDtoForm } from './models';

@Component({
    selector: 'cml-recipe-item-form',
    templateUrl: './recipe-item.form.html',
    styleUrl: './recipe-item.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TitleCasePipe, ReactiveFormsModule, ElementIdPipe, AsyncPipe],
    viewProviders: [provideControlContainer()],
})
export class RecipeItemForm {
    private readonly controlContainer = inject(ControlContainer);
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly destroyRef = inject(DestroyRef);
    private readonly changeDetectionRef = inject(ChangeDetectorRef);
    private readonly itemsService = inject(ItemsService);
    private readonly resourceService = inject(ResourceService);
    private readonly recipesService = inject(RecipesService);

    public readonly type = input.required<string>();

    protected readonly itemOptions$ = this.itemsService
        .getAll()
        .pipe(map((items) => items.map(({ id, name }) => ({ label: name, value: id }))));

    protected get recipeItemsFormArray() {
        return (this.controlContainer as FormGroupDirective).form.get(
            `${this.type()}s`
        ) as FormArray<RecipeItemDtoForm>;
    }

    protected shouldDisable(itemId: string, index: number) {
        const itemIds = this.recipeItemsFormArray.value.map((recipeItem) => recipeItem.itemId).filter(Boolean);

        if (itemIds.length === 0) return false;
        const indexOf = itemIds.indexOf(itemId);
        return indexOf > -1 && indexOf !== index;
    }

    protected onNewRecipeItem() {
        this.recipeItemsFormArray.push(addRecipeItem(this.environmentInjector, this.type()));
    }

    protected onRemoveRecipeItem(index: number) {
        const recipeId = this.resourceService.resourceId();
        if (recipeId === TEMP_RESOURCE_ID) {
            this.recipeItemsFormArray.removeAt(index);
            return;
        }
        const itemId = this.recipeItemsFormArray.value[index].itemId;

        this.recipesService[this.type() === 'input' ? 'removeInputFromRecipe' : 'removeOutputFromRecipe'](
            recipeId,
            itemId
        )
            .pipe(
                tap(() => {
                    const recipe = this.resourceService.resource() as RecipeDto;

                    recipe[this.type() === 'input' ? 'inputs' : 'outputs'].splice(index, 1);
                    this.resourceService.resource.set(recipe);
                    this.resourceService.updatedResource.set(recipe);

                    this.recipeItemsFormArray.removeAt(index);
                    this.changeDetectionRef.markForCheck();
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }
}
