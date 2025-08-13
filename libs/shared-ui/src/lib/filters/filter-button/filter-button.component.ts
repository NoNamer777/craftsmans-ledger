import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FilterIconComponent } from '../../icons';
import { SidebarService } from '../../sidebar';

@Component({
    selector: 'cml-filter-button',
    templateUrl: './filter-button.component.html',
    styleUrl: './filter-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FilterIconComponent],
})
export class FilterButtonComponent {
    private readonly sidebarService = inject(SidebarService);

    protected onOpenFiltersPanel() {
        this.sidebarService.openSidebar();
    }
}
