import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { SaveAction, SaveActions, TEMP_RESOURCE_ID } from '../models';
import { ResourceService } from './resource.service';

@Injectable({ providedIn: 'root' })
export class ActionsService {
    private readonly resourceService = inject(ResourceService);

    public readonly canSave = signal(false);

    public readonly saving = signal(false);

    public readonly canRemove = computed(() => Boolean(this.resourceService.resourceId()));

    public readonly removing = signal(false);

    public readonly canCreateNew = computed(
        () => this.resourceService.resourceId() !== TEMP_RESOURCE_ID && !this.canSave()
    );

    public readonly saveAction = computed(() => {
        if (this.resourceService.resourceId() === TEMP_RESOURCE_ID) return SaveActions.CREATE;
        return SaveActions.UPDATE;
    });

    private readonly removeResourceSubject = new Subject<void>();
    public readonly removeResource$ = this.removeResourceSubject.asObservable();

    private readonly newResourceSubject = new Subject<void>();
    public readonly newResource$ = this.newResourceSubject.asObservable();

    private readonly saveResourceSubject = new Subject<SaveAction>();
    public readonly saveResource$ = this.saveResourceSubject.asObservable();

    public removeResource() {
        this.removing.set(true);
        this.removeResourceSubject.next();
    }

    public newResource() {
        this.newResourceSubject.next();
    }

    public saveResource() {
        this.saving.set(true);
        this.saveResourceSubject.next(this.saveAction());
    }

    public reset() {
        this.canSave.set(false);
        this.saving.set(false);
        this.removing.set(false);
    }
}
