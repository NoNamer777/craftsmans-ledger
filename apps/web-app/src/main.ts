import { bootstrapApplication } from '@angular/platform-browser';
import { tryCatch } from '@craftsmans-ledger/shared';
import { appConfig, RootComponent } from './app';

async function bootstrap() {
    const { error: bootstrapError } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (bootstrapError) {
        console.error(bootstrapError);
    }
}

(async () => await bootstrap())();
