import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-locations-overview',
    templateUrl: './locations-overview.component.html',
    styleUrl: './locations-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class LocationsOverviewComponent {}
