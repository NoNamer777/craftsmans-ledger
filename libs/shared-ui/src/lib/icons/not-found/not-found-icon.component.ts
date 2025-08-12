import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-not-found-icon]',
    templateUrl: './not-found-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class NotFoundIconComponent {}
