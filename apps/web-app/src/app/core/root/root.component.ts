import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '@craftsmans-ledger/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'cml-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, HeaderComponent],
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
