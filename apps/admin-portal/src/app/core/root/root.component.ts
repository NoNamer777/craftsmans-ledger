import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService, NotificationsContainerComponent, SseService } from '@craftsmans-ledger/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'cml-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, HeaderComponent, NotificationsContainerComponent],
})
export class RootComponent implements OnInit, OnDestroy {
    private readonly sseService = inject(SseService);
    private readonly configService = inject(ConfigService);

    public ngOnInit() {
        this.sseService.subscribe(`${this.configService.config.baseApiUrl}/sse`);
    }

    public ngOnDestroy() {
        this.sseService.unsubscribe();
    }
}
