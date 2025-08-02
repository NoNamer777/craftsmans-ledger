import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ResourceType, resourceTypeAttribute, resourceTypeOptions } from '../../models';

@Component({
    selector: 'cml-resource-type-list',
    templateUrl: './type-list.component.html',
    styleUrl: './type-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ResourceTypeListComponent {
    public readonly resourceType = input.required({ transform: resourceTypeAttribute });

    public readonly resourceTypeChange = output<ResourceType>();

    protected readonly options = resourceTypeOptions;

    protected onSelectResourceType(value: string) {
        const resourceType = resourceTypeAttribute(value);
        this.resourceTypeChange.emit(resourceType);
    }
}
