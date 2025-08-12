import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-icon[cml-stopwatch-icon]',
    templateUrl: './stopwatch-icon.component.svg',
    styleUrl: '../icon.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchIconComponent {}