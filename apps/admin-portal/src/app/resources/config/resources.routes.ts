import { Routes } from '@angular/router';

export const resourcesRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).ResourcesOverviewPage,
    },
];
