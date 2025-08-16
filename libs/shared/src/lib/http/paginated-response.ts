export interface PaginatedResponse<T> {
    count: number;
    lastPage: number;
    page: number;
    data: T[];
}
