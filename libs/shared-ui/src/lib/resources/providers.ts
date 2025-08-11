import { inject, provideAppInitializer } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ItemsService } from './items';
import { RecipesService } from './recipes';
import { TechnologyTreesService } from './technology-trees';

export function initializeResourceServices() {
    return provideAppInitializer(() => {
        const itemsService = inject(ItemsService);
        const technologyTreesService = inject(TechnologyTreesService);
        const recipesService = inject(RecipesService);

        return forkJoin([technologyTreesService.initialize(), itemsService.initialize(), recipesService.initialize()]);
    });
}
