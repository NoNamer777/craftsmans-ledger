import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ResourceType, ResourceTypes } from '../models';
import { ResourceTypeListComponent } from './type-list';

@Component({
    selector: 'cml-resources-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourceTypeListComponent],
})
export class ResourcesOverviewPage {
    protected readonly resourceType = signal<ResourceType>(ResourceTypes.ITEMS);

    protected onResourceTypeChange(resourceType: ResourceType) {
        this.resourceType.set(resourceType);

        // this.setComponentPortal();
    }
}
