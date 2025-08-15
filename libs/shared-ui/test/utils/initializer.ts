import { isDevMode } from '@angular/core';
import { tryCatch } from '@craftsmans-ledger/shared';
import { initializeWorker, resetDatabases } from '../mocks';

export async function initializeMockEnvironment() {
    if (!isDevMode()) return true;

    const { error: resetDatabaseError } = await tryCatch(resetDatabases());

    if (resetDatabaseError) {
        console.error(resetDatabaseError);
        return false;
    }
    const { error: initializeWorkerError } = await tryCatch(initializeWorker());

    if (initializeWorkerError) {
        console.error(initializeWorkerError);
        return false;
    }
    return true;
}
