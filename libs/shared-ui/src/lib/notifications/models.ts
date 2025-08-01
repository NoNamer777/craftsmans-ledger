export const NotificationTypes = {
    INFO: 'info',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

type NotificationType = (typeof NotificationTypes)[keyof typeof NotificationTypes];

export interface Notification extends CreateNotificationData {
    id: string;
    requiresAction: boolean;
    actionLabel?: string;
}

export interface CreateNotificationData {
    type: NotificationType;
    title: string;
    message: string;
}
