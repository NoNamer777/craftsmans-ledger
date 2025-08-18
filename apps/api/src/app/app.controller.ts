import { SseMessageTypes } from '@craftsmans-ledger/shared';
import { Controller, Get, Sse } from '@nestjs/common';
import { map } from 'rxjs';
import { CacheService } from './core';

@Controller()
export class AppController {
    constructor(private readonly cacheService: CacheService) {}

    @Get()
    public root() {
        return {};
    }

    @Sse('/sse')
    public sse() {
        return this.cacheService.resetCacheOfType$.pipe(
            map((resourceType) => ({
                type: SseMessageTypes.INVALIDATE_CACHE,
                data: { invalidateCache: resourceType },
            }))
        );
    }
}
