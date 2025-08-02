import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResourceService {
    public readonly resourceId = signal<string>(null);
}
