export const WebSocketMessageTypes = {
    INVALIDATE_CACHE: 'invalidate-cache',
} as const;

export type WebSocketMessageType = (typeof WebSocketMessageTypes)[keyof typeof WebSocketMessageTypes];

export interface WebSocketMessage {
    type: WebSocketMessageType;
}

export class InvalidateCacheMessage implements WebSocketMessage {
    public type = WebSocketMessageTypes.INVALIDATE_CACHE;
}
