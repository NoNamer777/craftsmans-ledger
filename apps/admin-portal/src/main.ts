import 'reflect-metadata';

import { bootstrapApplication } from '@angular/platform-browser';
import { tryCatch } from '@craftsmans-ledger/shared-ui';
import { appConfig, RootComponent } from './app';

async function bootstrap() {
    const { error: bootstrapError } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (bootstrapError) {
        console.error(bootstrapError);
    }
}

(async () => await bootstrap())();
