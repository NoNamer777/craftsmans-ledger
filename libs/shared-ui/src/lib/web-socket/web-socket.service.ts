import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { ItemsService, RecipesService, TechnologyTreesService } from '../resources';
import { InvalidateCacheMessage, ResourceType, ResourceTypes, WebSocketMessage, WebSocketMessageTypes } from './models';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private configService = inject(ConfigService);
    private itemsService = inject(ItemsService);
    private recipesService = inject(RecipesService);
    private technologyTreesService = inject(TechnologyTreesService);

    private webSocket: WebSocket;

    public connect() {
        this.webSocket = new WebSocket(`${this.configService.config.baseApiUrl}/ws`);

        this.webSocket.addEventListener('open', () => this.onOpen());
        this.webSocket.addEventListener('close', (event) => this.onClose(event));
        this.webSocket.addEventListener('message', (message) => this.onMessage(message));
        this.webSocket.addEventListener('error', (event) => this.onError(event));
    }

    public closeConnection() {
        if (!this.webSocket) return;
        this.webSocket.close();
    }

    private onOpen() {
        console.log('WebSocket Connected');
    }

    private onClose(event: CloseEvent) {
        console.log('Web Socket connection closed', event);

        this.webSocket.removeEventListener('open', () => this.onOpen());
        this.webSocket.removeEventListener('close', (event) => this.onClose(event));
        this.webSocket.removeEventListener('message', (message) => this.onMessage(message));

        this.webSocket = null;
    }

    private onMessage(message: MessageEvent) {
        this.handleMessage(JSON.parse(message.data));
    }

    private onError(event: Event) {
        console.error('WebSocket error', event);
    }

    private handleMessage(message: WebSocketMessage) {
        switch (message.type) {
            case WebSocketMessageTypes.INVALIDATE_CACHE:
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
