import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'resources',
        loadChildren: async () => (await import('../../resources')).resourcesRoutes,
    },
];
