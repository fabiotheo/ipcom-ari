import { EventEmitter } from "events";
import type { AriClient } from "./ariClient";
import type { BaseClient } from "./baseClient.js";
import type { WebSocketEventType } from "./interfaces";
/**
 * WebSocketClient handles real-time communication with the Asterisk server.
 * Extends EventEmitter to provide event-based communication patterns.
 */
export declare class WebSocketClient extends EventEmitter {
    private readonly baseClient;
    private readonly apps;
    private readonly subscribedEvents?;
    private readonly ariClient?;
    private ws?;
    private isReconnecting;
    private readonly maxReconnectAttempts;
    private readonly backOffOptions;
    /**
     * Creates a new WebSocket client instance.
     *
     * @param {BaseClient} baseClient - The base client containing connection details
     * @param {string[]} apps - List of applications to connect to
     * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of events to subscribe to
     * @param {AriClient} [ariClient] - Optional ARI client for handling channel and playback events
     */
    constructor(baseClient: BaseClient, apps: string[], subscribedEvents?: WebSocketEventType[] | undefined, ariClient?: AriClient | undefined);
    /**
     * Establishes a WebSocket connection.
     *
     * @returns {Promise<void>} Resolves when connection is established
     * @throws {Error} If connection fails
     */
    connect(): Promise<void>;
    /**
     * Initializes WebSocket connection with reconnection logic.
     *
     * @param {string} wsUrl - The WebSocket URL to connect to
     * @returns {Promise<void>} Resolves when connection is established
     */
    private initializeWebSocket;
    /**
     * Processes incoming WebSocket messages.
     *
     * @param {string} rawMessage - The raw message received from WebSocket
     */
    private handleMessage;
    /**
     * Attempts to reconnect to the WebSocket.
     *
     * @param {string} wsUrl - The WebSocket URL to reconnect to
     */
    private reconnect;
    /**
     * Manually closes the WebSocket connection.
     */
    close(): void;
    /**
     * Checks if the WebSocket is currently connected.
     *
     * @returns {boolean} True if connected, false otherwise
     */
    isConnected(): boolean;
    /**
     * Gets the current connection state.
     *
     * @returns {number} The WebSocket ready state
     */
    getState(): number;
}
//# sourceMappingURL=websocketClient.d.ts.map