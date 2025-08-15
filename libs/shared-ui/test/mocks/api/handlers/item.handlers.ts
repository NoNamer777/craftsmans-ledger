import { delay, http, HttpHandler, HttpResponse } from 'msw';
import { CreateItemData, Item, PaginatedResponse } from '../../../../src';
import { mockItemDB } from '../../db';
import { baseApiUrl } from '../api.models';
import { sendBadRequestExceptionResponse, sendExceptionResponse, sendNotFoundExceptionResponse } from './expections';
import { serialize, tryCatch } from '@craftsmans-ledger/shared';

const endPoint = '/items';

export const itemHandlers: HttpHandler[] = [
    http.get<never, never, Item[]>(`${baseApiUrl}${endPoint}`, async () => {
        await delay();
        return HttpResponse.json(mockItemDB.getAll());
    }),
    http.post<never, CreateItemData>(`${baseApiUrl}${endPoint}`, async ({ request }) => {
        await delay();

        const data = serialize(CreateItemData, await request.json());
        const url = request.url;

        const { data: result, error } = await tryCatch(() => mockItemDB.create(data));

        if (error) return sendExceptionResponse(error);
        return HttpResponse.json(result, { headers: { Location: `${url}/${result.id}` } });
    }),
    http.get<never, never>(`${baseApiUrl}${endPoint}/query`, async ({ request }) => {
        await delay();

        const url = new URL(request.url);
        const result = mockItemDB.query(url.searchParams);

        if (!result) return sendNotFoundExceptionResponse('The query resulted in no results.');
        return HttpResponse.json(result);
    }),
    http.get<never, never, PaginatedResponse<Item>>(`${baseApiUrl}${endPoint}/paginated`, ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json(mockItemDB.paginated(url.searchParams));
    }),
    // Need to have this handler at the bottom of the list, otherwise all path params after the `/items/` part will be
    // considered to be an ID of an Item.
    http.get<{ itemId: string }, never>(`${baseApiUrl}${endPoint}/:itemId`, async ({ params }) => {
        await delay();

        const { itemId } = params;
        const result = mockItemDB.getById(itemId);

        if (!result) return sendNotFoundExceptionResponse(`Item with ID "${itemId}" was not found.`);
        return HttpResponse.json(result);
    }),
    http.put<{ itemId: string }, Item>(`${baseApiUrl}${endPoint}/:itemId`, async ({ params, request }) => {
        await delay();

        const { itemId } = params;
        const data = serialize(Item, await request.json());

        if (itemId !== data.id) {
            return sendBadRequestExceptionResponse(
                `Could not update Item with ID "${data.id}" - Reason: It's forbidden to update Item on path "${itemId}" with data from Item with ID "${data.id}".`
            );
        }
        const { data: result, error } = await tryCatch(() => mockItemDB.update(data));

        if (error) return sendExceptionResponse(error);
        return HttpResponse.json(result);
    }),
    http.delete<{ itemId: string }>(`${baseApiUrl}${endPoint}/:itemId`, async ({ params }) => {
        await delay();

        const { itemId } = params;
        const { error } = await tryCatch(() => mockItemDB.remove(itemId));

        if (error) return sendExceptionResponse(error);
        return HttpResponse.json();
    }),
];
