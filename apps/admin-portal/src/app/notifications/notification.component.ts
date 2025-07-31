import { AsyncPipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Toast } from 'bootstrap';
import { interval, map } from 'rxjs';
import { Notification, NotificationTypes } from './models';

/** Time to update the timestamp in ms. Currently set to 60 seconds. */
const INTERVAL_TIME = 60_000 as const;

@Component({
    selector: 'cml-notification',
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AsyncPipe, NgClass],
})
export class NotificationComponent implements AfterViewInit {
    public readonly notification = input.required<Notification>();

    public readonly toastHidden = output<string>();

    protected readonly notificationType = computed(() => {
        switch (this.notification().type) {
            case NotificationTypes.SUCCESS:
                return 'bg-success';

            case NotificationTypes.ERROR:
                return 'bg-danger';

            case NotificationTypes.INFO:
            default:
                return '';
        }
    });

    protected readonly createdAt = new Date().getTime();

    protected readonly timestamp$ = interval(INTERVAL_TIME).pipe(
        map(() => new Date().getTime()),
        map((currentTime) => Math.round(currentTime - this.createdAt / 1000))
    );

    private toastElement: HTMLElement;

    public ngAfterViewInit() {
        this.toastElement = document.getElementById(this.notification().id);

        this.toastElement.addEventListener('hidden.bs.toast', () => this.onToastHidden());
        Toast.getOrCreateInstance(this.toastElement).show();
    }

    private onToastHidden() {
        this.toastElement.removeEventListener('hidden.bs.toast', () => this.onToastHidden());
        this.toastHidden.emit(this.notification().id);
    }
}
