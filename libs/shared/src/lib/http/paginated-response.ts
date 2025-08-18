import { Expose } from 'class-transformer';

export class PaginatedResponse<T> {
    @Expose()
    count: number;

    @Expose()
    lastPage: number;

    @Expose()
    page: number;

    @Expose()
    data: T[];
}
