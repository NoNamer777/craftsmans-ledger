import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, NotificationTypes } from '../notifications';

export function notifyError(error: unknown, notificationService: NotificationService) {
    if (error instanceof HttpErrorResponse) {
        notificationService.addNotification({
            title: `${error.error.error ?? error.statusText} (${error.status})`,
            message: error.error.message ?? error.message,
            type: NotificationTypes.ERROR,
        });
    }
    if (error instanceof Error) {
        notificationService.addNotification({
            title: 'Unknown Error',
            message: error.message,
            type: NotificationTypes.ERROR,
        });
    }
}
