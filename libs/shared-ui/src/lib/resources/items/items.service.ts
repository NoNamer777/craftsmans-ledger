import { inject, Injectable } from '@angular/core';
import {
    CreateItemData,
    Item,
    ItemQueryParamName,
    ItemQueryParams,
    PaginatedResponse,
    serialize,
    serializeAll,
} from '@craftsmans-ledger/shared';
import { from, map, of, tap } from 'rxjs';
import { StorageKeys } from '../../browser-storage';
import { CacheService } from '../../cache';
import { ApiService } from '../../http';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    private readonly apiService = inject(ApiService);
    private readonly cacheService = new CacheService(StorageKeys.CACHE_ITEMS, Item);

    private readonly endPoint = '/items';

    public initialize() {
        return from(this.cacheService.loadCacheFromStorage());
    }

    public clearCache() {
        this.cacheService.clear();
    }

    public getAll() {
        if (this.cacheService.hasCache) return of(this.cacheService.cache);
        return this.apiService.get<Item[]>(this.endPoint).pipe(
            map((response) => serializeAll(Item, response.body)),
            tap((items) => (this.cacheService.cache = items))
        );
    }

    public query(params?: ItemQueryParams) {
        return this.apiService.get<PaginatedResponse<Item>, ItemQueryParamName>(`${this.endPoint}/query`, params).pipe(
            map((response) => {
                response.body.data = serializeAll(Item, response.body.data);
                return serialize(PaginatedResponse<Item>, response.body);
            })
        );
    }

    public create(item: CreateItemData) {
        return this.apiService
            .post<CreateItemData, Item>(this.endPoint, item)
            .pipe(map((response) => serialize(Item, response.body)));
    }

    public getById(itemId: string) {
        const fetchResourceFromApi = this.apiService
            .get<Item>(`${this.endPoint}/${itemId}`)
            .pipe(map((response) => serialize(Item, response.body)));

        if (this.cacheService.hasCache) {
            const cachedResource = this.cacheService.getResourceById(itemId);
            return cachedResource ? of(cachedResource) : fetchResourceFromApi;
        }
        return fetchResourceFromApi;
    }

    public update(item: Item) {
        return this.apiService
            .put<Item>(`${this.endPoint}/${item.id}`, item)
            .pipe(map((response) => serialize(Item, response.body)));
    }

    public remove(itemId: string) {
        return this.apiService.delete(`${this.endPoint}/${itemId}`);
    }
}
