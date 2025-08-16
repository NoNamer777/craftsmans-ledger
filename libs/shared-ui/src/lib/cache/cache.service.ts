import { inject, Type } from '@angular/core';
import { Resource, serializeAll } from '@craftsmans-ledger/shared';
import { BrowserStorageService, StorageKey } from '../browser-storage';

export class CacheService<T extends Resource> {
    private readonly browserStorageService = inject(BrowserStorageService);

    private _cache: T[] = [];

    private readonly resourceType: Type<T>;

    private readonly storageKey: StorageKey;

    constructor(storageKey: StorageKey, resourceType: Type<T>) {
        this.storageKey = storageKey;
        this.resourceType = resourceType;
    }

    public async loadCacheFromStorage() {
        const cache = serializeAll(this.resourceType, await this.browserStorageService.getItem(this.storageKey));

        if (!cache) return;
        this.cache = cache;
    }

    public getResourceById(resourceId: string): T {
        return this._cache.find(({ id }) => id === resourceId);
    }

    public get cache() {
        return this._cache;
    }

    public set cache(resources: T[]) {
        this._cache = [...resources].sort((curr, next) => curr.label().localeCompare(next.label()));
        this.browserStorageService.setItem(this.storageKey, this._cache);
    }

    public get hasCache() {
        return this._cache.length !== 0;
    }

    public clear() {
        this._cache = [];
        this.browserStorageService.removeItem(this.storageKey);
    }
}
