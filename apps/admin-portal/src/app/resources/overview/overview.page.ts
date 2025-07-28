import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BrowserStorageService } from '@craftsmans-ledger/shared-ui';
import { BrowserStorageKeys, ResourceType, resourceTypeAttribute } from '../models';
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
    private readonly browserStorage = inject(BrowserStorageService);

    protected readonly resourceType = signal<ResourceType>(null);

    protected readonly componentPortal = signal<ComponentPortal<unknown>>(null);

    public ngOnInit() {
        this.readResourceTypeFromBrowserStorage();
        this.setComponentPortal();
    }

    protected onResourceTypeChange(resourceType: ResourceType) {
        this.resourceType.set(resourceType);
        this.browserStorage.setItem(BrowserStorageKeys.RESOURCE_TYPE, resourceType);

        this.setComponentPortal();
    }

    private setComponentPortal() {
        const component = this.getResourceOverviewComponent();
        this.componentPortal.set(new ComponentPortal(component));
    }

    private getResourceOverviewComponent() {
        return resourceTypeComponents[this.resourceType()];
    }

    private readResourceTypeFromBrowserStorage() {
        const storedValue = this.browserStorage.getItem(BrowserStorageKeys.RESOURCE_TYPE);
        const resourceType = resourceTypeAttribute(storedValue);

        if (storedValue !== resourceType) {
            this.browserStorage.setItem(BrowserStorageKeys.RESOURCE_TYPE, resourceType);
        }
        this.resourceType.set(resourceType);
    }
}
