export type QueryParamType = string | number | boolean;

export type QueryParams = Record<string, QueryParamType | QueryParamType[]>;

export interface PaginatedResponse<T> {
    data: T[];
    maxPages: number;
    page: number;
    totalNumberOfResults: number;
}
