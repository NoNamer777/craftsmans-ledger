import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActionsService {
    public readonly canSave = signal(false);

    public readonly canRemove = signal(false);

    private readonly removeResourceSubject = new Subject<void>();
    public readonly removeResource$ = this.removeResourceSubject.asObservable();

    private readonly newResourceSubject = new Subject<void>();
    public readonly newResource$ = this.newResourceSubject.asObservable();

    public removeResource() {
        this.removeResourceSubject.next();
    }

    public newResource() {
        this.newResourceSubject.next();
    }

    public reset() {
        this.canRemove.set(false);
        this.canSave.set(false);
    }
}
