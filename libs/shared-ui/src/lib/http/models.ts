export type QueryParamType = string | number | boolean;

export type QueryParams<Key extends string = string> = {
    [queryParam in Key]?: QueryParamType | QueryParamType[];
};

export interface PaginatedResponse<T> {
    count: number;
    lastPage: number;
    page: number;
    data: T[];
}
