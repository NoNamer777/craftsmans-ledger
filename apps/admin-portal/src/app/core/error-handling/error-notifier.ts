import { ErrorHandler, inject, Injectable } from '@angular/core';
import { NotificationService } from '@craftsmans-ledger/shared-ui';
import { notifyError } from './functions';

@Injectable({ providedIn: 'root' })
export class ErrorNotifier implements ErrorHandler {
    private readonly notificationService = inject(NotificationService);

    public handleError(error: unknown) {
        notifyError(error, this.notificationService);
        console.error(error);
    }
}
