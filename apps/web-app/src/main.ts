import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent, tryCatch } from './app';

async function bootstrap() {
    const { error } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
