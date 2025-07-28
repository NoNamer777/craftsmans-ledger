import { SetupWorker, setupWorker } from 'msw/browser';
import { apiHandlers } from './handlers';

let worker: SetupWorker;

export function getMockServiceWorker() {
    return worker;
}

export async function initializeWorker() {
    worker = setupWorker(...apiHandlers);

    await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true,
    });
}

export function resetWorker() {
    worker.resetHandlers();
}

export function stopWorker() {
    worker.stop();
}
