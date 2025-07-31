import { QueryParams } from '@craftsmans-ledger/shared-ui';
import { Resource } from '../models';

export class Item implements Resource {
    public id: string;
    public name: string;
    public weight: number;
    public baseValue: number;

    public compareTo(other: unknown) {
        if (this === other) return true;
        if (!this.isItem(other)) return false;

        return this.name === other.name && this.weight === other.weight && this.baseValue === other.baseValue;
    }

    public isItem(value: unknown): value is Item {
        return value instanceof Item;
    }
}

export class ItemBuilder {
    private item = new Item();

    public build() {
        return this.item;
    }

    public constructor(value?: unknown) {
        if (typeof value !== 'object') return;

        if ('name' in value && typeof value.name === 'string') this.item.name = value.name;
        if ('weight' in value && typeof value.weight === 'number') this.item.weight = value.weight;
        if ('baseValue' in value && typeof value.baseValue === 'number') this.item.baseValue = value.baseValue;
    }

    public withId(itemId: string) {
        this.item.id = itemId;
        return this;
    }

    public withName(name: string) {
        this.item.name = name;
        return this;
    }

    public withWeight(weight: number) {
        this.item.weight = weight;
        return this;
    }

    public withBaseValue(baseValue: number) {
        this.item.baseValue = baseValue;
        return this;
    }
}

export const SortableItemAttributes = {
    NAME: 'name',
    WEIGHT: 'weight',
    BASE_VALUE: 'baseValue',
} as const;

export type SortableItemAttribute = (typeof SortableItemAttributes)[keyof typeof SortableItemAttributes];

export const SortOrders = {
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
} as const;

export type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export const DEFAULT_SORT_ORDER = SortOrders.ASCENDING;

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
