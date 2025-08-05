export interface Resource {
    id: string;

    label(): string;
}

export const SortOrders = {
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
} as const;

export type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export const DEFAULT_SORT_ORDER = SortOrders.ASCENDING;
