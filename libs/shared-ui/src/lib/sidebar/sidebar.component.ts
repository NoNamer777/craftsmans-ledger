import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { SidebarService } from './sidebar.service';

@Component({
    selector: 'cml-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PortalModule],
})
export class SidebarComponent implements OnInit {
    protected readonly sidebarService = inject(SidebarService);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly componentPortal = signal<Portal<unknown>>(null);

    public ngOnInit() {
        this.sidebarService.open$
            .pipe(
                tap(() => this.componentPortal.set(new ComponentPortal(this.sidebarService.component()))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    protected onCloseSidebar() {
        this.sidebarService.closeSidebar(null);
    }
}
