import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ResourceOption } from './models';

@Component({
    selector: 'cml-resources-list',
    templateUrl: './resources-list.html',
    styleUrl: './resources-list.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ResourcesList {
    public readonly resourceOptions = input.required<ResourceOption[]>();

    public readonly selectedResourceChanged = output<string>();

    private readonly selectedResource = signal<string>(null);

    protected onResourceSelected(resourceId: string) {
        this.selectedResourceChanged.emit(resourceId);
    }

    protected isActive(resourceId: string) {
        return resourceId === this.selectedResource();
    }
}
