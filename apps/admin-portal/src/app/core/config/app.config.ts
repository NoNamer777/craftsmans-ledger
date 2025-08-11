import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
    initializeResourceServices,
    provideBrowserStorage,
    provideClientConfig,
    provideErrorHandler,
} from '@craftsmans-ledger/shared-ui';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(appRoutes),
        provideHttpClient(),
        initializeResourceServices(),
        provideClientConfig(),
        provideBrowserStorage(),
        provideErrorHandler(),
    ],
};
