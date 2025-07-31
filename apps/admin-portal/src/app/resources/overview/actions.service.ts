import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ResourceService } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ActionsService {
    private readonly resourceService = inject(ResourceService);

    public readonly canSave = signal(false);

    public readonly canRemove = computed(() => Boolean(this.resourceService.resourceId()));

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
        this.canSave.set(false);
    }
}
