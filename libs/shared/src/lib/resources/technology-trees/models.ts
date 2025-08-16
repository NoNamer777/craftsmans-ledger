export const SortableTechnologyTreeAttributes = {
    NAME: 'name',
    MAX_POINTS: 'maxPoints',
} as const;

export type SortableTechnologyTreeAttribute =
    (typeof SortableTechnologyTreeAttributes)[keyof typeof SortableTechnologyTreeAttributes];

export const DEFAULT_TECHNOLOGY_TREE_SORTING_ATTRIBUTE = SortableTechnologyTreeAttributes.NAME;
