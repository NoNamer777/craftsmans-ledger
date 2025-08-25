export const SortableRecipeAttributes = {
    NAME: 'name',
    CRAFTING_TIME: 'craftingTime',
    TECHNOLOGY_TREE: 'technologyTree',
    TECH_POINTS: 'techPoints',
} as const;

export type SortableRecipeAttribute = (typeof SortableRecipeAttributes)[keyof typeof SortableRecipeAttributes];

export const DEFAULT_RECIPE_SORTING_ATTRIBUTE = SortableRecipeAttributes.NAME;
