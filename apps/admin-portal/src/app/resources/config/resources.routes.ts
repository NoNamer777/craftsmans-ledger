import { Routes } from '@angular/router';

export const resourcesRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).ResourcesOverviewPage,
        children: [
            {
                path: ':resourceType',
                loadComponent: async () => (await import('../overview')).ResourcesOverviewPage,
                children: [
                    {
                        path: ':resourceId',
                        loadComponent: async () => (await import('../overview')).ResourcesOverviewPage,
                    },
                ],
            },
        ],
    },
];
