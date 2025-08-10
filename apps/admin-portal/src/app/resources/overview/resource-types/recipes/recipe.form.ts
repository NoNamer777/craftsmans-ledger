import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EnvironmentInjector, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    RecipeDto,
    RecipeItemDto,
    RecipesService,
    serialize,
    TechnologyTreesService,
} from '@craftsmans-ledger/shared-ui';
import { debounceTime, map, of, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { BaseResourceFormComponent } from '../base-resource-form.component';
import { addRecipeItem, RecipeItemDtoForm, TEMP_RECIPE } from './models';
import { RecipeItemForm } from './recipe-item.form';

@Component({
    selector: 'cml-recipe-form',
    templateUrl: './recipe.form.html',
    styleUrl: './recipe.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, AsyncPipe, RecipeItemForm],
})
export class RecipeForm extends BaseResourceFormComponent {
    protected readonly recipesService = inject(RecipesService);
    private readonly formBuilder = inject(FormBuilder);
    protected readonly environmentInjector = inject(EnvironmentInjector);
    private readonly actionsService = inject(ActionsService);
    private readonly technologyTreesService = inject(TechnologyTreesService);

    protected override readonly form = this.formBuilder.group({
        craftingTime: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
        technologyTreeId: this.formBuilder.control<string>('', [Validators.required]),
        technologyPoints: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
        inputs: this.formBuilder.array<RecipeItemDtoForm>([]),
        outputs: this.formBuilder.array<RecipeItemDtoForm>([]),
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
        return this.recipesService.getById(resourceId).pipe(map((recipe) => recipe.toDto()));
    }

    protected override populateForm() {
        const { craftingTime, technologyTreeId, technologyPoints, inputs, outputs } =
            this.resourceService.resource() as RecipeDto;

        this.form.reset({
            craftingTime: craftingTime,
            technologyTreeId: technologyTreeId ?? '',
            technologyPoints: technologyPoints,
        });

        this.form.controls.inputs.clear();
        (inputs ?? []).forEach((dto, index) => {
            this.form.controls.inputs.insert(index, addRecipeItem(this.environmentInjector, 'input', dto));
        });

        this.form.controls.outputs.clear();
        (outputs ?? []).forEach((dto, index) => {
            this.form.controls.outputs.insert(index, addRecipeItem(this.environmentInjector, 'output', dto));
        });
    }

    protected override onFormChange() {
        const formRecipe = this.createRecipeFromFormValue();

        if (formRecipe.technologyTreeId && formRecipe.technologyTreeId !== TEMP_RESOURCE_ID) {
            this.technologyTreesService
                .getById(formRecipe.technologyTreeId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (technologyTree) => {
                        this.form.controls.technologyPoints.setValidators([
                            Validators.required,
                            Validators.min(0),
                            Validators.max(technologyTree.maxPoints),
                        ]);
                        this.updateAndCompare(formRecipe);

                        this.form.controls.technologyPoints.updateValueAndValidity({ emitEvent: false });
                    },
                });
            return;
        }
        this.updateAndCompare(formRecipe);
    }

    private updateAndCompare(recipe: RecipeDto) {
        this.resourceService.updatedResource.set(recipe);

        const hasChanged = !(this.resourceService.resource() as RecipeDto).compareTo(recipe);

        if (this.actionsService.canSave() === hasChanged) return;
        this.actionsService.canSave.set(hasChanged);
    }

    private createRecipeFromFormValue() {
        const formValue = this.form.value;
        const dto = new RecipeDto();

        dto.id = this.resourceService.resourceId();
        dto.craftingTime = formValue.craftingTime;
        dto.technologyTreeId = formValue.technologyTreeId;
        dto.technologyPoints = formValue.technologyPoints;
        dto.inputs = formValue.inputs.map((inputValue) => serialize(RecipeItemDto, inputValue));
        dto.outputs = formValue.outputs.map((inputValue) => serialize(RecipeItemDto, inputValue));
        return dto;
    }
}
