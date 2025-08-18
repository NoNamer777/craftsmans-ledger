import { ResourceType } from '@craftsmans-ledger/shared';
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class CacheService {
    private readonly resetCacheOfTypeSubject = new Subject<ResourceType>();

    public readonly resetCacheOfType$ = this.resetCacheOfTypeSubject.asObservable();

    public resetCacheOfType(type: ResourceType) {
        this.resetCacheOfTypeSubject.next(type);
    }
}
