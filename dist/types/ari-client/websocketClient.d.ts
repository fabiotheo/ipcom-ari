export declare class WebSocketClient {
    private url;
    private ws;
    private isClosedManually;
    private isReconnecting;
    constructor(url: string);
    connect(): Promise<void>;
    reconnect(): Promise<void>;
    isConnected(): boolean;
    on(event: string, callback: (data: any) => void): void;
    send(data: any): void;
    close(): void;
}
//# sourceMappingURL=websocketClient.d.ts.map