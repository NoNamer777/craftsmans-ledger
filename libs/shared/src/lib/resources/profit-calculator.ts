import { Recipe } from '@craftsmans-ledger/shared';

export class ProfitCalculator {
    private readonly profitForItem = new Map<string, number>();
    private recipesByCraftedItem = new Map<string, Recipe[]>();

    public setRecipes(recipes: Recipe[]) {
        recipes.forEach((recipe) =>
            recipe.outputs.forEach(({ item }) => {
                if (!this.recipesByCraftedItem.has(item.id)) this.recipesByCraftedItem.set(item.id, []);
                this.recipesByCraftedItem.get(item.id).push(recipe);
            })
        );
    }

    public calculateProfitForItem(itemId: string) {
        if (this.profitForItem.has(itemId)) return this.profitForItem.get(itemId);
        const recipes = this.recipesByCraftedItem.get(itemId);

        if (!recipes || recipes.length === 0) {
            this.profitForItem.set(itemId, 0);
            return this.profitForItem.get(itemId);
        }
        const profits = recipes.map((recipe) => {
            const expenses = recipe.inputs.reduce((sum, input) => {
                const profit = this.calculateProfitForItem(input.item.id);
                const inputValue = (input.item.cost + profit) * input.quantity;

                return sum + inputValue;
            }, 0);

            const revenue = recipe.outputs.reduce((sum, output) => sum + output.item.cost * output.quantity, 0);

            const recipeProfit = revenue - expenses;

            if (revenue === 0) return -Infinity;
            const targetItem = recipe.outputs.find(({ item }) => item.id === itemId);

            const profitOfTarget = targetItem.item.cost * targetItem.quantity;
            const profitShare = recipeProfit * (profitOfTarget / profitOfTarget);

            return profitShare / targetItem.quantity;
        });

        const maxProfit = Math.max(...profits);

        this.profitForItem.set(itemId, maxProfit);
        return maxProfit;
    }
}
