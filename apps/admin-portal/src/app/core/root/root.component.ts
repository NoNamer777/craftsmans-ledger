import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsContainerComponent } from '@craftsmans-ledger/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'cml-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, HeaderComponent, NotificationsContainerComponent],
})
export class RootComponent {}
