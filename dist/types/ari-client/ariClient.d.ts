import type { AriClientConfig, WebSocketEvent, WebSocketEventType } from "./interfaces";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { Bridges } from "./resources/bridges";
import { type ChannelInstance, Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { type PlaybackInstance, Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
export declare class AriClient {
    private config;
    private readonly baseClient;
    private webSocketClient?;
    channels: Channels;
    endpoints: Endpoints;
    applications: Applications;
    playbacks: Playbacks;
    sounds: Sounds;
    asterisk: Asterisk;
    bridges: Bridges;
    constructor(config: AriClientConfig);
    /**
     * Inicializa uma conexão WebSocket.
     */
    connectWebSocket(apps: string[], subscribedEvents?: WebSocketEventType[]): Promise<void>;
    /**
     * Adiciona um listener para eventos do WebSocket.
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Adiciona um listener único para eventos do WebSocket.
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Remove um listener para eventos do WebSocket.
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Fecha a conexão WebSocket.
     */
    closeWebSocket(): void;
    /**
     * Inicializa uma nova instância de `ChannelInstance` para manipular canais localmente.
     */
    Channel(channelId?: string): ChannelInstance;
    /**
     * Inicializa uma nova instância de `PlaybackInstance` para manipular playbacks.
     */
    Playback(playbackId?: string, _app?: string): PlaybackInstance;
}
//# sourceMappingURL=ariClient.d.ts.map