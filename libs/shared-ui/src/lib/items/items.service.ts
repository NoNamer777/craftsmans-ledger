import { inject, Injectable } from '@angular/core';
import { ApiService, PaginatedResponse } from '../http';
import {
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

    private readonly endPoint = '/items';

    public getAll() {
        return this.apiService.get<Item>(this.endPoint);
    }

    public getById(itemId: string) {
        return this.apiService.get<Item>(`${this.endPoint}/${itemId}`);
    }

    public query(params: ItemQueryParams) {
        return this.apiService.get<Item, ItemQueryParamName>(`${this.endPoint}/query`, params);
    }

    public paginated(params: ItemPaginationParams = DEFAULT_ITEM_PAGINATION_PARAMS) {
        return this.apiService.get<PaginatedResponse<Item>, ItemPaginationParamName>(
            `${this.endPoint}/paginated`,
            params
        );
    }
}
