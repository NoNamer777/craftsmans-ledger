import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from '../config';
import { WebSocketMessage } from './models';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private configService = inject(ConfigService);

    private webSocket: WebSocket;

    private messagesSubject = new Subject<WebSocketMessage>();
    public readonly messages$ = this.messagesSubject.asObservable();

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
        this.messagesSubject.next(JSON.parse(message.data));
    }

    private onError(event: Event) {
        console.error('WebSocket error', event);
    }
}
