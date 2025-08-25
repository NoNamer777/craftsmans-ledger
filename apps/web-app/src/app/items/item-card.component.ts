import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Item } from '@craftsmans-ledger/shared';
import {
    ChevronDownIconComponent,
    ChevronUpIconComponent,
    CoinsIconComponent,
    StopwatchIconComponent,
    WeightHangingIconComponent,
} from '@craftsmans-ledger/shared-ui';
import { ProfitCalculatorService } from './profit-calculator.service';

@Component({
    selector: 'cml-item-card',
    templateUrl: './item-card.component.html',
    styleUrl: './item-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ChevronDownIconComponent,
        ChevronUpIconComponent,
        WeightHangingIconComponent,
        DecimalPipe,
        CoinsIconComponent,
        StopwatchIconComponent,
    ],
})
export class ItemCardComponent {
    private readonly profitCalculatorService = inject(ProfitCalculatorService);

    public readonly item = input.required<Item>();

    public readonly index = input.required<number>();

    protected readonly toggled = signal(false);

    protected readonly itemRecipes = computed(() =>
        this.profitCalculatorService.recipes.filter((recipe) => recipe.createsItem(this.item().id))
    );

    protected readonly hasRecipe = computed(() => this.itemRecipes().length > 0);

    protected readonly hasOneRecipe = computed(() => this.itemRecipes().length === 1);

    protected readonly hasMultipleRecipes = computed(() => this.itemRecipes().length > 1);

    protected readonly craftingTime = computed(() => this.itemRecipes()[0].craftingTime);

    protected readonly profit = computed(() => this.profitCalculatorService.calculateProfitForItem(this.item().id));

    protected onToggle() {
        this.toggled.update((toggled) => !toggled);
    }
}
