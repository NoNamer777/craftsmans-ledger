export const ResourceTypes = {
    ITEMS: 'items',
    LOCATIONS: 'locations',
    REALMS: 'realms',
    RECIPES: 'recipes',
    STRUCTURES: 'structures',
    TECHNOLOGY_TREES: 'technology-trees',
    VENDOR_TYPE: 'vendor-types',
    VILLAGERS: 'villagers',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export function resourceTypeAttribute(value: unknown) {
    return Object.values(ResourceTypes).find((resourceType) => resourceType === value) ?? ResourceTypes.ITEMS;
}

interface ResourceTypeOption {
    label: string;
    value: ResourceType;
    disabled: boolean;
}

export const resourceTypeOptions: ResourceTypeOption[] = [
    { disabled: false, label: 'Items', value: ResourceTypes.ITEMS },
    { disabled: true, label: 'Locations', value: ResourceTypes.LOCATIONS },
    { disabled: true, label: 'Realms', value: ResourceTypes.REALMS },
    { disabled: false, label: 'Recipes', value: ResourceTypes.RECIPES },
    { disabled: true, label: 'Structures', value: ResourceTypes.STRUCTURES },
    { disabled: false, label: 'Technology Trees', value: ResourceTypes.TECHNOLOGY_TREES },
    { disabled: true, label: 'Vendor Types', value: ResourceTypes.VENDOR_TYPE },
    { disabled: true, label: 'Villagers', value: ResourceTypes.VILLAGERS },
] as const;

export const TEMP_RESOURCE_ID = 'TEMP' as const;

export const SaveActions = {
    CREATE: 'create',
    UPDATE: 'update',
} as const;

export type SaveAction = (typeof SaveActions)[keyof typeof SaveActions];
