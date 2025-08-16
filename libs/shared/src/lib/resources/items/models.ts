import { DEFAULT_SORT_ORDER, QueryParams, SortOrder } from '../../http';

export const SortableItemAttributes = {
    NAME: 'name',
    WEIGHT: 'weight',
    BASE_VALUE: 'baseValue',
} as const;

export type SortableItemAttribute = (typeof SortableItemAttributes)[keyof typeof SortableItemAttributes];

export const DEFAULT_ITEM_SORTING_ATTRIBUTE = SortableItemAttributes.NAME;

export const ItemQueryParamNames = {
    NAME: 'name',
} as const;

export type ItemQueryParamName = (typeof ItemQueryParamNames)[keyof typeof ItemQueryParamNames];

export interface ItemQueryParams extends QueryParams<ItemQueryParamName> {
    [ItemQueryParamNames.NAME]?: string;
}

export const ItemPaginationParamNames = {
    SORT_BY: 'sortBy',
    ORDER: 'order',
    OFFSET: 'offset',
    LIMIT: 'limit',
} as const;

export type ItemPaginationParamName = (typeof ItemPaginationParamNames)[keyof typeof ItemPaginationParamNames];

export interface ItemPaginationParams extends QueryParams {
    [ItemPaginationParamNames.SORT_BY]?: SortableItemAttribute;
    [ItemPaginationParamNames.ORDER]?: SortOrder;
    [ItemPaginationParamNames.LIMIT]?: number;
    [ItemPaginationParamNames.OFFSET]?: number;
}

export const DEFAULT_ITEM_PAGINATION_PARAMS: ItemPaginationParams = {
    [ItemPaginationParamNames.SORT_BY]: DEFAULT_ITEM_SORTING_ATTRIBUTE,
    [ItemPaginationParamNames.ORDER]: DEFAULT_SORT_ORDER,
};
