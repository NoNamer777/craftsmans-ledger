import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ActionsService } from '../../../actions.service';
import { ResourceOption } from './models';

@Component({
    selector: 'cml-resources-list',
    templateUrl: './resources-list.component.html',
    styleUrl: './resources-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ResourcesListComponent {
    private readonly actionsService = inject(ActionsService);

    public readonly resourceOptions = input.required<ResourceOption[]>();

    public readonly selectedResourceChanged = output<string>();

    private readonly selectedResource = signal<string>(null);

    protected onResourceSelected(resourceId: string) {
        if (this.selectedResource() === resourceId) return;

        this.selectedResource.set(resourceId);

        this.actionsService.canSave.set(false);
        this.actionsService.canRemove.set(true);

        this.selectedResourceChanged.emit(resourceId);
    }

    protected isActive(resourceId: string) {
        return resourceId === this.selectedResource();
    }
}
