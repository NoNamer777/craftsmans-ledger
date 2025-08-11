import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsContainerComponent, WebSocketService } from '@craftsmans-ledger/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'cml-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, HeaderComponent, NotificationsContainerComponent],
})
export class RootComponent implements OnInit, OnDestroy {
    private readonly webSocketService = inject(WebSocketService);

    public ngOnInit() {
        this.webSocketService.connect();
    }

    public ngOnDestroy() {
        this.webSocketService.closeConnection();
    }
}
