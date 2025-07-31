import { ClassProvider, ErrorHandler } from '@angular/core';
import { ErrorNotifier } from './error-notifier';

export function provideErrorHandler(): ClassProvider {
    return {
        provide: ErrorHandler,
        useClass: ErrorNotifier,
    };
}
