export type QueryParamType = string | number | boolean;

export type QueryParams<Key extends string = string> = {
    [queryParam in Key]?: QueryParamType | QueryParamType[];
};

export interface PaginatedResponse<T> {
    data: T[];
    maxPages: number;
    page: number;
    totalNumberOfResults: number;
}
