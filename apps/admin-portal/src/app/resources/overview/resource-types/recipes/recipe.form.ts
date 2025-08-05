import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recipe, RecipeBuilder, RecipesService, TechnologyTreesService } from '@craftsmans-ledger/shared-ui';
import { debounceTime, map, of, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { BaseResourceFormComponent } from '../base-resource-form.component';
import { TEMP_RECIPE } from './models';

@Component({
    selector: 'cml-recipe-form',
    templateUrl: './recipe.form.html',
    styleUrl: './recipe.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, AsyncPipe],
})
export class RecipeForm extends BaseResourceFormComponent {
    protected readonly recipesService = inject(RecipesService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly actionsService = inject(ActionsService);
    private readonly technologyTreesService = inject(TechnologyTreesService);

    protected override readonly form = this.formBuilder.group({
        craftingTime: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
        technologyTreeId: this.formBuilder.control<string>('', [Validators.required]),
        technologyPoints: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
    });

    protected readonly technologyTreeOptions = this.technologyTreesService
        .getAll()
        .pipe(map((technologyTrees) => technologyTrees.map(({ id, name }) => ({ value: id, label: name }))));

    constructor() {
        super();

        this.form.valueChanges
            .pipe(
                debounceTime(1000),
                tap(() => this.onFormChange()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected override getResource(resourceId: string) {
        if (resourceId === TEMP_RESOURCE_ID) return of(TEMP_RECIPE);
        this.isLoading.set(true);
        return this.recipesService.getById(resourceId);
    }

    protected override populateForm() {
        const { craftingTime, technologyTree, technologyPoints } = this.resourceService.resource() as Recipe;

        this.form.reset({
            craftingTime: craftingTime,
            technologyTreeId: technologyTree?.id ?? '',
            technologyPoints: technologyPoints,
        });
    }

    protected override onFormChange() {
        const formRecipe = this.createRecipeFromFormValue();

        if (formRecipe.technologyTree?.id !== (this.resourceService.updatedResource() as Recipe)?.technologyTree?.id) {
            if (formRecipe.technologyTree?.id) {
                this.technologyTreesService
                    .getById(formRecipe.technologyTree.id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: ({ maxPoints }) => {
                            this.form.controls.technologyPoints.setValidators([
                                Validators.required,
                                Validators.min(0),
                                Validators.max(maxPoints),
                            ]);
                            this.form.controls.technologyPoints.updateValueAndValidity();
                        },
                    });
            }
        }
        this.resourceService.updatedResource.set(formRecipe);

        const hasChanged = !(this.resourceService.resource() as Recipe).compareTo(formRecipe);

        if (this.actionsService.canSave() === hasChanged) return;
        this.actionsService.canSave.set(hasChanged);
    }

    private createRecipeFromFormValue() {
        return new RecipeBuilder(this.form.value).withId(this.resourceService.resourceId()).build();
    }
}
