import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ResourceType, ResourceTypes } from '../models';
import { resourceTypeComponents } from './resource-types';
import { ResourceTypeListComponent } from './type-list';

@Component({
    selector: 'cml-resources-overview',
    templateUrl: './overview.page.html',
    styleUrl: './overview.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ResourceTypeListComponent, PortalModule],
})
export class ResourcesOverviewPage implements OnInit {
    protected readonly resourceType = signal<ResourceType>(ResourceTypes.ITEMS);

    protected readonly componentPortal = signal<ComponentPortal<unknown>>(null);

    public ngOnInit() {
        this.setComponentPortal();
    }

    protected onResourceTypeChange(resourceType: ResourceType) {
        this.resourceType.set(resourceType);

        this.setComponentPortal();
    }

    private setComponentPortal() {
        const component = this.getResourceOverviewComponent();
        this.componentPortal.set(new ComponentPortal(component));
    }

    private getResourceOverviewComponent() {
        return resourceTypeComponents[this.resourceType()];
    }
}
