import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recipe, RecipeBuilder, RecipesService } from '@craftsmans-ledger/shared-ui';
import { debounceTime, of, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { BaseResourceFormComponent } from '../base-resource-form.component';
import { TEMP_ITEM } from '../items/models';

@Component({
    selector: 'cml-recipe-form',
    templateUrl: './recipe.form.html',
    styleUrl: './recipe.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
})
export class RecipeForm extends BaseResourceFormComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly actionsService = inject(ActionsService);
    protected readonly recipesService = inject(RecipesService);

    protected override readonly form = this.formBuilder.group({
        craftingTime: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
        technologyTreeId: this.formBuilder.control<string>('', [Validators.required]),
        technologyPoints: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
    });

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
        if (resourceId === TEMP_RESOURCE_ID) return of(TEMP_ITEM);
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
        this.resourceService.updatedResource.set(formRecipe);

        const hasChanged = !(this.resourceService.resource() as Recipe).compareTo(formRecipe);

        if (this.actionsService.canSave() === hasChanged) return;
        this.actionsService.canSave.set(hasChanged);
    }

    private createRecipeFromFormValue() {
        return new RecipeBuilder(this.form.value).withId(this.resourceService.resourceId()).build();
    }
}
