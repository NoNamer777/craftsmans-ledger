import { Injectable, signal } from '@angular/core';
import { Resource } from '@craftsmans-ledger/shared-ui';

@Injectable({ providedIn: 'root' })
export class ResourceService {
    public readonly resourceId = signal<string>(null);

    public readonly resource = signal<Resource>(null);

    public readonly updatedResource = signal<Resource>(null);
}
