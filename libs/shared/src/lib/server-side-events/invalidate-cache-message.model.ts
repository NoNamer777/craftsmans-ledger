import { ResourceType } from '@craftsmans-ledger/shared';
import { SseMessage } from './sse-message.model';
import { SseMessageTypes } from './sse-message.type';

export interface InvalidateCacheData {
    resourceType: ResourceType;
}

export class InvalidateCacheMessage implements SseMessage {
    public type = SseMessageTypes.INVALIDATE_CACHE;
    public data: InvalidateCacheData;
}
