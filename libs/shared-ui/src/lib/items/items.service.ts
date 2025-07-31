import { inject, Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
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
        return this.apiService.get<Item[]>(this.endPoint).pipe(map((data) => plainToInstance(Item, data)));
    }

    public getById(itemId: string) {
        return this.apiService.get<Item>(`${this.endPoint}/${itemId}`).pipe(map((data) => plainToInstance(Item, data)));
    }

    public query(params: ItemQueryParams) {
        return this.apiService
            .get<Item, ItemQueryParamName>(`${this.endPoint}/query`, params)
            .pipe(map((data) => plainToInstance(Item, data)));
    }

    public paginated(params: ItemPaginationParams = DEFAULT_ITEM_PAGINATION_PARAMS) {
        return this.apiService
            .get<PaginatedResponse<Item>, ItemPaginationParamName>(`${this.endPoint}/paginated`, params)
            .pipe(
                map((response) => {
                    response.data = plainToInstance(Item, response.data);
                    return response;
                })
            );
    }

    public remove(itemId: string) {
        return this.apiService.delete(`${this.endPoint}/${itemId}`);
    }
}
