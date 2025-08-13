import { Injectable, signal, Type } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
    public readonly component = signal<Type<unknown>>(null);

    public readonly title = signal('Sidebar');

    private readonly openSubject = new Subject<void>();
    public readonly open$ = this.openSubject.asObservable();

    private readonly closeSubject = new Subject<unknown>();
    public readonly close$ = this.closeSubject.asObservable();

    public openSidebar() {
        this.openSubject.next();
    }

    public closeSidebar<T>(result: T) {
        this.closeSubject.next(result);
    }
}
