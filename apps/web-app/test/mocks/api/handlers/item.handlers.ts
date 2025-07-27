import { http, HttpResponse } from 'msw';
import { Item } from '../../../../src/app';
import { mockItemDB } from '../../db';
import { baseApiUrl } from '../api.models';

const endPoint = '/items';

export const itemHandlers = [
    http.get<never, never, Item[]>(`${baseApiUrl}${endPoint}`, () => {
        return HttpResponse.json(mockItemDB.getAll());
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
