import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-chevron-up-icon]',
    templateUrl: './chevron-up-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronUpIconComponent {}
