export const ResourceTypes = {
    ITEMS: 'items',
    LOCATIONS: 'locations',
    REALMS: 'realms',
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
}

export const resourceTypeOptions: ResourceTypeOption[] = [
    { label: 'Items', value: ResourceTypes.ITEMS },
    { label: 'Locations', value: ResourceTypes.LOCATIONS },
    { label: 'Realms', value: ResourceTypes.REALMS },
    { label: 'Structures', value: ResourceTypes.STRUCTURES },
    { label: 'Technology Trees', value: ResourceTypes.TECHNOLOGY_TREES },
    { label: 'Vendor Types', value: ResourceTypes.VENDOR_TYPE },
    { label: 'Villagers', value: ResourceTypes.VILLAGERS },
] as const;
