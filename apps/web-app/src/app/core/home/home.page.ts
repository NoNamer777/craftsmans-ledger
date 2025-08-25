import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ItemsOverviewComponent } from '../../items';

@Component({
    selector: 'cml-home',
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ItemsOverviewComponent],
})
export class HomePage {}
