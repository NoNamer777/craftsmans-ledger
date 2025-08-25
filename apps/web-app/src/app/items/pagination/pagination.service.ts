import { computed, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
    public readonly count = signal(0);

    public readonly page = signal(0);

    public readonly lastPage = signal(1);

    public readonly nextPage = computed(() => Math.min(this.page() + 1, this.lastPage()));

    public readonly previousPage = computed(() => Math.max(this.page() - 1, 1));

    private readonly pageSubject = new Subject<number>();
    public readonly page$ = this.pageSubject.asObservable();

    public fetchPage(page: number) {
        this.pageSubject.next(page);
    }

    public fetchPreviousPage() {
        this.fetchPage(this.previousPage());
    }

    public fetchNextPage() {
        this.fetchPage(this.nextPage());
    }
}
