import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { NotFoundIconComponent } from '../icons';

@Component({
    selector: 'cml-not-found',
    templateUrl: './not-found.page.html',
    styleUrl: './not-found.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NotFoundIconComponent],
})
export class NotFoundPage {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    protected onVisitHomePage() {
        from(this.router.navigateByUrl('/')).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
}
