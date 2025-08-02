import { FactoryProvider, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('BrowserStorage');

export function provideBrowserStorage(storage: Storage = sessionStorage) {
    return {
        provide: BROWSER_STORAGE,
        useFactory: () => storage,
    } satisfies FactoryProvider;
}
