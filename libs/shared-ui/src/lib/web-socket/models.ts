export const WebSocketMessageTypes = {
    INVALIDATE_CACHE: 'invalidate-cache',
} as const;

type WebSocketMessageType = (typeof WebSocketMessageTypes)[keyof typeof WebSocketMessageTypes];

export interface WebSocketMessage {
    type: WebSocketMessageType;
}

export const ResourceTypes = {
    TECHNOLOGY_TREES: 'TechnologyTrees',
    RECIPES: 'Recipes',
    ITEMS: 'Items',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export interface InvalidateCacheData {
    resourceType: ResourceType;
}

export class InvalidateCacheMessage implements WebSocketMessage {
    public type = WebSocketMessageTypes.INVALIDATE_CACHE;
    public data: InvalidateCacheData;
}
