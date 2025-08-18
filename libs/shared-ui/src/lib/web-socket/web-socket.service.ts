import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private configService = inject(ConfigService);

    private listeners = {
        open: () => this.onOpen(),
        close: (event: CloseEvent) => this.onClose(event),
        message: (message: MessageEvent) => this.onMessage(message),
        error: (event: Event) => this.onError(event),
    };

    private webSocket: WebSocket;

    public connect() {
        this.webSocket = new WebSocket(`${this.configService.config.baseApiUrl}/ws`);

        this.webSocket.addEventListener('open', this.listeners['open']);
        this.webSocket.addEventListener('close', this.listeners['close']);
        this.webSocket.addEventListener('message', this.listeners['message']);
        this.webSocket.addEventListener('error', this.listeners['error']);
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

        this.webSocket.removeEventListener('open', this.listeners['open']);
        this.webSocket.removeEventListener('close', this.listeners['close']);
        this.webSocket.removeEventListener('message', this.listeners['message']);
        this.webSocket.removeEventListener('error', this.listeners['error']);

        this.webSocket = null;
    }

    private onMessage(message: MessageEvent) {
        console.log('Received message over via Web Socket', message);
    }

    private onError(event: Event) {
        console.error('WebSocket error', event);
    }
}
