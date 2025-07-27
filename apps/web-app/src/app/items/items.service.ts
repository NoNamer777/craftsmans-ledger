import { inject, Injectable } from '@angular/core';
import { ApiService, Item } from '../shared';
import { ItemQueryParams } from './models';

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
        return this.apiService.get<Item>(`${this.endPoint}/query`, params);
    }
}
