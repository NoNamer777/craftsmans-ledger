import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { ResourceType, resourceTypeAttribute } from '../models';
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
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);

    protected readonly resourceType = signal<ResourceType>(null);

    protected readonly componentPortal = signal<ComponentPortal<unknown>>(null);

    public ngOnInit() {
        this.readResourceTypeFromRoute();
        this.setComponentPortal();
    }

    protected onResourceTypeChange(resourceType: ResourceType) {
        this.resourceType.set(resourceType);

        from(this.router.navigateByUrl(`/resources/${resourceType}`))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.setComponentPortal(),
            });
    }

    private setComponentPortal() {
        const component = this.getResourceOverviewComponent();
        this.componentPortal.set(new ComponentPortal(component));
    }

    private getResourceOverviewComponent() {
        return resourceTypeComponents[this.resourceType()];
    }

    private readResourceTypeFromRoute() {
        const url = this.router.routerState.snapshot.url;
        const resourceTypeParam = url.split('/')[2];
        const resourceType = resourceTypeAttribute(resourceTypeParam);

        if (resourceTypeParam !== resourceType) {
            from(this.router.navigateByUrl(`/resources/${resourceType}`))
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
        this.resourceType.set(resourceType);
    }
}
