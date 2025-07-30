import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionsService } from '../actions.service';

@Component({
    selector: 'cml-action-buttons',
    templateUrl: './action-buttons.component.html',
    styleUrl: './action-buttons.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class ActionButtonsComponent {
    protected readonly actionsService = inject(ActionsService);

    protected onRemove() {
        this.actionsService.remove.next();
    }
}
