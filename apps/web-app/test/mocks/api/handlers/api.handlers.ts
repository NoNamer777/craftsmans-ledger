import { HttpHandler } from 'msw';
import { itemHandlers } from './item.handlers';

export const apiHandlers: HttpHandler[] = [...itemHandlers];
