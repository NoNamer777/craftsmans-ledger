import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PaginationService } from './pagination.service';

@Component({
    selector: 'cml-pagination',
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class PaginationComponent {
    protected readonly paginationService = inject(PaginationService);

    protected readonly isOnFirstPage = computed(() => this.paginationService.page() === 1);

    protected readonly isOnLastPage = computed(
        () => this.paginationService.page() === this.paginationService.lastPage()
    );
}
