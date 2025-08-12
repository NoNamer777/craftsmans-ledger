import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'not-found',
        loadComponent: async () => (await import('@craftsmans-ledger/shared-ui')).NotFoundPage,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
