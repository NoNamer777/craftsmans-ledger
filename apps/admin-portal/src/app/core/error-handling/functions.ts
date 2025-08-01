import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, NotificationTypes } from '@craftsmans-ledger/shared-ui';

export function notifyError(error: unknown, notificationService: NotificationService) {
    if (error instanceof HttpErrorResponse) {
        notificationService.addNotification({
            title: `${error.error.error} (${error.error.status})`,
            message: error.error.message,
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
