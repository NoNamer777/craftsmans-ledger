export const ResourceTypes = {
    ITEMS: 'Items',
    RECIPES: 'Recipes',
    TECHNOLOGY_TREES: 'TechnologyTrees',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];
