import { http, HttpResponse } from 'msw';
import { Item } from '../../../../src/app';
import { mockItemDB } from '../../db';
import { baseApiUrl } from '../api.models';

const endPoint = '/items';

export const itemHandlers = [
    http.get<never, never, Item[]>(`${baseApiUrl}${endPoint}`, () => {
        return HttpResponse.json(mockItemDB.getAll());
    }),
];
