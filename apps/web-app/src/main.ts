import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { initializeWorker } from '@craftsmans-ledger/web-app/test';
import { appConfig, RootComponent, tryCatch } from './app';

async function bootstrap() {
    if (isDevMode()) {
        const { error: initializeWorkerError } = await tryCatch(initializeWorker());

        if (initializeWorkerError) {
            console.error(initializeWorkerError);
            return;
        }
    }
    const { error: bootstrapError } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (bootstrapError) {
        console.error(bootstrapError);
    }
}

(async () => await bootstrap())();
