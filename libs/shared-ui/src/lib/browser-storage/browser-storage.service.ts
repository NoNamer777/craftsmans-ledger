import { inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from './providers';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
    private readonly storage = inject(BROWSER_STORAGE);

    public getItem<T>(key: string): T {
        return JSON.parse(this.storage.getItem(key));
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
