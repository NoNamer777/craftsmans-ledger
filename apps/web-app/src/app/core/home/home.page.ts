import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'cml-home',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class HomePage {}
