export const SortOrders = {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
} as const;

export type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export const DEFAULT_SORT_ORDER = SortOrders.ASCENDING;

export function sortOrderAttribute(value: unknown): SortOrder {
    return Object.values(SortOrders).find((sortOrder) => sortOrder === value) ?? DEFAULT_SORT_ORDER;
}

export function isSortOrder(value: unknown): boolean {
    return Boolean(Object.values(SortOrders).find((sortOrder) => sortOrder === value));
}
