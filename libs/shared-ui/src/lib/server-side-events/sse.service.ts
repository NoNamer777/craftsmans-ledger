import { inject, Injectable } from '@angular/core';
import {
    InvalidateCacheMessage,
    ResourceType,
    ResourceTypes,
    SseMessage,
    SseMessageTypes,
} from '@craftsmans-ledger/shared';
import { ItemsService, RecipesService, TechnologyTreesService } from '../resources';

@Injectable({ providedIn: 'root' })
export class SseService {
    private itemsService = inject(ItemsService);
    private recipesService = inject(RecipesService);
    private technologyTreesService = inject(TechnologyTreesService);

    private eventSource: EventSource;

    private listeners = {
        open: (event: Event) => this.onOpen(event),
        error: (event: Event) => this.onError(event),
        message: (message: MessageEvent) => this.onMessage(message),
    };

    public subscribe(url: string) {
        this.eventSource = new EventSource(url);

        this.eventSource.addEventListener('open', this.listeners['open']);
        this.eventSource.addEventListener('error', this.listeners['error']);
        this.eventSource.addEventListener('message', this.listeners['message']);
    }

    public unsubscribe() {
        if (!this.eventSource) return;
        this.eventSource.close();

        this.eventSource.removeEventListener('open', this.listeners['open']);
        this.eventSource.removeEventListener('error', this.listeners['error']);
        this.eventSource.removeEventListener('message', this.listeners['message']);

        this.eventSource = null;
    }

    private onOpen(event: Event) {
        console.log('SSE connection opened', event);
    }

    private onError(event: Event) {
        console.error('SSE connection errored', event);
    }

    private onMessage(message: MessageEvent) {
        this.handleMessage(JSON.parse(message.data));
    }

    private handleMessage(message: SseMessage) {
        switch (message.type) {
            case SseMessageTypes.INVALIDATE_CACHE:
                this.onInvalidateResourceCache((message as InvalidateCacheMessage).data.resourceType);
                return;

            default:
                console.error(`Invalid WebSocketMessageType "${message.type}"`);
        }
    }

    private onInvalidateResourceCache(resourceType: ResourceType) {
        switch (resourceType) {
            case ResourceTypes.TECHNOLOGY_TREES:
                this.technologyTreesService.clearCache();
                return;

            case ResourceTypes.ITEMS:
                this.itemsService.clearCache();
                return;

            case ResourceTypes.RECIPES:
                this.recipesService.clearCache();
                return;

            default:
                console.error(`Invalid resource type "${resourceType}"`);
        }
    }
}
