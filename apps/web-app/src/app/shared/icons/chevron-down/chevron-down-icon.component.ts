import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-chevron-down-icon]',
    templateUrl: './chevron-down-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronDownIconComponent {}
