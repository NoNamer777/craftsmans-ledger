export const StorageKeys = {
    CACHE_ITEMS: 'items',
    CACHE_TECHNOLOGY_TREES: 'technology-trees',
    CACHE_RECIPES: 'recipes',
    ITEM_FILTERS: 'item-filters',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
