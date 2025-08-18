import { Expose } from 'class-transformer';
import { SortOrder } from './sort-order';

export const DEFAULT_LIMIT = 20 as const;

export const DEFAULT_OFFSET = 0 as const;

export class StandardQueryParams {
    @Expose()
    sortOrder: SortOrder;

    @Expose()
    limit: number;

    @Expose()
    offset: number;
}
