import { inject, provideAppInitializer } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ItemsService } from './items/items.service';
import { RecipesService } from './recipes/recipes.service';
import { TechnologyTreesService } from './technology-trees/technology-trees.service';

export function initializeResourceServices() {
    return provideAppInitializer(() => {
        const itemsService = inject(ItemsService);
        const technologyTreesService = inject(TechnologyTreesService);
        const recipesService = inject(RecipesService);

        return forkJoin([technologyTreesService.initialize(), itemsService.initialize(), recipesService.initialize()]);
    });
}
