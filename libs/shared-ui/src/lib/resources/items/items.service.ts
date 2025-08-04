import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
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

    private readonly endPoint = '/items';

    public getAll() {
        return this.apiService.get<Item[]>(this.endPoint).pipe(map((data) => serializeAll(Item, data)));
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
                    response.data = serializeAll(Item, response.data);
                    return response;
                })
            );
    }

    public getById(itemId: string) {
        return this.apiService.get<Item>(`${this.endPoint}/${itemId}`).pipe(map((data) => serialize(Item, data)));
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
