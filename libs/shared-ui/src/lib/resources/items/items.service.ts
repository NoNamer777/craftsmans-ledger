import { inject, Injectable } from '@angular/core';
import { from, map, of, tap } from 'rxjs';
import { StorageKeys } from '../../browser-storage/models';
import { CacheService } from '../../cache';
import { ApiService, PaginatedResponse } from '../../http';
import { serialize, serializeAll } from '../../utils';
import {
    CreateItemData,
    DEFAULT_ITEM_PAGINATION_PARAMS,
    Item,
    ItemPaginationParamName,
    ItemPaginationParams,
    ItemQueryParamName,
    ItemQueryParams,
} from './models';

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

    public create(item: CreateItemData) {
        return this.apiService
            .post<CreateItemData, Item>(this.endPoint, item)
            .pipe(map((response) => serialize(Item, response.body)));
    }

    public query(params: ItemQueryParams) {
        return this.apiService
            .get<Item, ItemQueryParamName>(`${this.endPoint}/query`, params)
            .pipe(map((data) => serialize(Item, data)));
    }

    public paginated(params: ItemPaginationParams = DEFAULT_ITEM_PAGINATION_PARAMS) {
        return this.apiService
            .get<PaginatedResponse<Item>, ItemPaginationParamName>(`${this.endPoint}/paginated`, params)
            .pipe(
                map((response) => {
                    const data = response.body;
                    data.data = serializeAll(Item, data.data);
                    return data;
                })
            );
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
