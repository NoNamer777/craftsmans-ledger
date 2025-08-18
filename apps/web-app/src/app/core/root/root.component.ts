import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService, SseService } from '@craftsmans-ledger/shared-ui';
import { HeaderComponent } from '../header';

@Component({
    selector: 'cml-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, HeaderComponent],
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
