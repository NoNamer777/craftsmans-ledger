import { inject, Injectable, provideAppInitializer } from '@angular/core';
import { tap } from 'rxjs';
import { RequestService } from '../../shared';
import { ClientConfig } from './models';

export function provideClientConfig() {
    return provideAppInitializer(() => {
        const configService = inject(ConfigService);
        return configService.initialize();
    });
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private readonly requestService = inject(RequestService);

    public get config() {
        return this._config;
    }
    private _config: ClientConfig;

    public initialize() {
        return this.requestService.get<ClientConfig>('/config.json').pipe(tap((config) => (this._config = config)));
    }
}
