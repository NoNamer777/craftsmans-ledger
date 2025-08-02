import { Injectable, signal } from '@angular/core';
import { nanoid } from 'nanoid';
import { CreateNotificationData, Notification } from './models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    public readonly notifications = signal<Notification[]>([]);

    public addNotification(data: CreateNotificationData) {
        const notification: Notification = {
            id: nanoid(),
            requiresAction: false,
            ...data,
        };
        this.notifications.update((notifications) => [...notifications, notification]);
    }
}
