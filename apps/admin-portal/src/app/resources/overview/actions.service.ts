import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActionsService {
    public readonly canSave = signal(false);

    public readonly canRemove = signal(false);

    public readonly remove = new Subject<void>();

    public readonly removeResource = this.remove.asObservable();

    public reset() {
        this.canRemove.set(false);
        this.canSave.set(false);
    }
}
