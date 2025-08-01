import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';

@Component({
    selector: 'cml-notifications-container',
    templateUrl: './notifications-container.component.html',
    styleUrl: './notifications-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NotificationComponent],
})
export class NotificationsContainerComponent {
    protected readonly notificationService = inject(NotificationService);

    protected onToastHidden(notificationId: string) {
        this.notificationService.notifications.update((notifications) =>
            notifications.filter(({ id }) => id !== notificationId)
        );
    }
}
