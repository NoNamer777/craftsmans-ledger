import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-items-overview',
    templateUrl: './items-overview.component.html',
    styleUrl: './items-overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ItemsOverviewComponent {}
