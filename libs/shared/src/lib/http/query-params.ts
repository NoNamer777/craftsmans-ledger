export type QueryParamType = string | number | boolean;

export type QueryParams<Key extends string = string> = {
    [queryParam in Key]?: QueryParamType | QueryParamType[];
};
