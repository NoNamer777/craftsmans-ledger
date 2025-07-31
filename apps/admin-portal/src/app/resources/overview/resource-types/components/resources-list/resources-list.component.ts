import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ActionsService } from '../../../actions.service';
import { ResourceService } from '../../../resource.service';
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
    private readonly resourceService = inject(ResourceService);

    public readonly resourceOptions = input.required<ResourceOption[]>();

    public readonly selectedResourceChange = output<string>();

    protected onResourceSelected(resourceId: string) {
        if (this.resourceService.resourceId() === resourceId) return;
        this.selectedResourceChange.emit(resourceId);
        this.resourceService.resourceId.set(resourceId);

        this.actionsService.canSave.set(false);
        this.actionsService.canRemove.set(true);
    }

    protected isActive(resourceId: string) {
        return resourceId === this.resourceService.resourceId();
    }
}
