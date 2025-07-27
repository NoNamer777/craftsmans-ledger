import { inject, Injectable } from '@angular/core';
import { ApiService, Item } from '../shared';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    private readonly apiService = inject(ApiService);

    private readonly endPoint = '/items';

    public getAll() {
        return this.apiService.get<Item>(this.endPoint);
    }
}
