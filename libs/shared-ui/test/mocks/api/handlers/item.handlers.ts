import { http, HttpResponse } from 'msw';
import { Item, PaginatedResponse } from '../../../../src';
import { mockItemDB } from '../../db';
import { baseApiUrl } from '../api.models';

const endPoint = '/items';

export const itemHandlers = [
    http.get<never, never, Item[]>(`${baseApiUrl}${endPoint}`, () => {
        return HttpResponse.json(mockItemDB.getAll());
    }),
    http.get<never, never>(`${baseApiUrl}${endPoint}/query`, ({ request }) => {
        const url = new URL(request.url);
        const result = mockItemDB.query(url.searchParams);

        if (!result) {
            return HttpResponse.json(
                {
                    message: 'The query resulted in no results.',
                    timestamp: new Date(),
                    error: 'Not Found',
                    code: 404,
                },
                {
                    type: 'error',
                    status: 404,
                }
            );
        }
        return HttpResponse.json(result);
    }),
    http.get<never, never, PaginatedResponse<Item>>(`${baseApiUrl}${endPoint}/paginated`, ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json(mockItemDB.paginated(url.searchParams));
    }),
    // Need to have this handler at the bottom of the list, otherwise all path params after the `/items/` part will be
    // considered to be an ID of an Item.
    http.get<{ itemId: string }, never>(`${baseApiUrl}${endPoint}/:itemId`, ({ params }) => {
        const { itemId } = params;
        const result = mockItemDB.getById(itemId);

        if (!result) {
            return HttpResponse.json(
                {
                    message: `Item with ID "${itemId}" was not found.`,
                    timestamp: new Date(),
                    error: 'Not Found',
                    code: 404,
                },
                {
                    type: 'error',
                    status: 404,
                }
            );
        }
        return HttpResponse.json(result);
    }),
];
