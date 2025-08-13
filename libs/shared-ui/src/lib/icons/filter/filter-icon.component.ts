import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-filter-icon]',
    templateUrl: './filter-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterIconComponent {}
