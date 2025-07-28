import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-villagers-overview',
    templateUrl: './villagers-overview.component.html',
    styleUrl: './villagers-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class VillagersOverviewComponent {}
