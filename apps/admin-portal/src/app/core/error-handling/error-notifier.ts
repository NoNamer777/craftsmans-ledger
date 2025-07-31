import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { NotificationService, NotificationTypes } from '../../notifications';

@Injectable({ providedIn: 'root' })
export class ErrorNotifier implements ErrorHandler {
    private readonly notificationService = inject(NotificationService);

    public handleError(error: unknown) {
        if (error instanceof HttpErrorResponse) {
            this.notificationService.addNotification({
                title: `${error.error.error} (${error.error.status})`,
                message: error.error.message,
                type: NotificationTypes.ERROR,
            });
        }
        if (error instanceof Error) {
            this.notificationService.addNotification({
                title: 'Unknown Error',
                message: error.message,
                type: NotificationTypes.ERROR,
            });
        }
        console.error(error);
    }
}
