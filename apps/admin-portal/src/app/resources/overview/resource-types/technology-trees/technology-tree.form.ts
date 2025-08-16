import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyTreesService } from '@craftsmans-ledger/shared-ui';
import { debounceTime, of, tap } from 'rxjs';
import { TEMP_RESOURCE_ID } from '../../../models';
import { ActionsService } from '../../actions.service';
import { BaseResourceFormComponent } from '../base-resource-form.component';
import { TEMP_TECHNOLOGY_TREE } from './models';
import { TechnologyTree, TechnologyTreeBuilder } from '@craftsmans-ledger/shared';

@Component({
    selector: 'cml-technology-tree-form',
    templateUrl: './technology-tree.form.html',
    styleUrl: './technology-tree.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
})
export class TechnologyTreeForm extends BaseResourceFormComponent {
    private readonly formBuilder = inject(FormBuilder);
    private readonly actionsService = inject(ActionsService);
    protected readonly technologyTreesService = inject(TechnologyTreesService);

    protected override readonly form = this.formBuilder.group({
        name: this.formBuilder.control<string>('', [Validators.required, Validators.minLength(2)]),
        maxPoints: this.formBuilder.control<number>(0, [Validators.required, Validators.min(0)]),
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
        if (resourceId === TEMP_RESOURCE_ID) return of(TEMP_TECHNOLOGY_TREE);
        this.isLoading.set(true);
        return this.technologyTreesService.getById(resourceId);
    }

    protected override populateForm() {
        const { name, maxPoints } = this.resourceService.resource() as TechnologyTree;

        this.form.reset({
            name: name,
            maxPoints: maxPoints,
        });
    }

    protected override onFormChange() {
        const formTechnologyTree = this.createTechnologyTreeFromFormValue();
        this.resourceService.updatedResource.set(formTechnologyTree);

        const hasChanged = !(this.resourceService.resource() as TechnologyTree).compareTo(formTechnologyTree);

        if (this.actionsService.canSave() === hasChanged) return;
        this.actionsService.canSave.set(hasChanged);
    }

    private createTechnologyTreeFromFormValue() {
        return new TechnologyTreeBuilder(this.form.value).withId(this.resourceService.resourceId()).build();
    }
}
