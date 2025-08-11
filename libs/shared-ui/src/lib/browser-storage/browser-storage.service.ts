import { inject, Injectable } from '@angular/core';
import { tryCatch } from '../utils';
import { BROWSER_STORAGE } from './providers';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
    private readonly storage = inject(BROWSER_STORAGE);

    public async getItem(key: string) {
        const { data, error } = await tryCatch(() => JSON.parse(this.storage.getItem(key)));

        if (error) {
            this.removeItem(key);
            return null;
        }
        return data;
    }

    public setItem<T>(key: string, value: T) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    public removeItem(key: string) {
        this.storage.removeItem(key);
    }

    public clear() {
        this.storage.clear();
    }
}
