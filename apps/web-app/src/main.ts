import { bootstrapApplication } from '@angular/platform-browser';
import { tryCatch } from '@craftsmans-ledger/shared-ui';
import { initializeMockEnvironment } from '@craftsmans-ledger/shared-ui/test';
import { appConfig, RootComponent } from './app';

async function bootstrap() {
    if (!(await initializeMockEnvironment())) return;

    const { error: bootstrapError } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (bootstrapError) {
        console.error(bootstrapError);
    }
}

(async () => await bootstrap())();
