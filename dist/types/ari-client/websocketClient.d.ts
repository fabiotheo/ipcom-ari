import { EventEmitter } from "events";
import type { AriClient } from "./ariClient";
import type { BaseClient } from "./baseClient.js";
import type { WebSocketEventType } from "./interfaces";
export declare class WebSocketClient extends EventEmitter {
    private baseClient;
    private apps;
    private subscribedEvents?;
    private ariClient?;
    private ws?;
    private isReconnecting;
    private readonly maxReconnectAttempts;
    private readonly backOffOptions;
    constructor(baseClient: BaseClient, // BaseClient contém baseUrl, username, e password
    apps: string[], // Lista de aplicativos a serem conectados
    subscribedEvents?: WebSocketEventType[] | undefined, // Lista de eventos a serem assinados
    ariClient?: AriClient | undefined);
    /**
     * Conecta ao WebSocket.
     */
    connect(): Promise<void>;
    /**
     * Inicializa a conexão WebSocket com lógica de reconexão.
     */
    private initializeWebSocket;
    /**
     * Processa as mensagens recebidas do WebSocket.
     */
    private handleMessage;
    /**
     * Tenta reconectar ao WebSocket.
     */
    private reconnect;
    /**
     * Fecha o WebSocket manualmente.
     */
    close(): void;
}
//# sourceMappingURL=websocketClient.d.ts.map