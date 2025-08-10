import { inject, Injectable, provideAppInitializer } from '@angular/core';
import { map, tap } from 'rxjs';
import { RequestService } from '../http';
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
        return this.requestService.get<ClientConfig>('/config.json').pipe(
            map((response) => response.body),
            tap((config) => (this._config = config))
        );
    }
}
