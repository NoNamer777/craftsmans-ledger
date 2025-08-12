import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-trash-icon]',
    templateUrl: './trash-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrashIconComponent {}
