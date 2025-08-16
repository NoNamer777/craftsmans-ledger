export const SortOrders = {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
} as const;

export type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export const DEFAULT_SORT_ORDER = SortOrders.ASCENDING;
