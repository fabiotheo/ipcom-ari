import { EventEmitter } from 'events';
import type { AriClient } from './ariClient';
import type { BaseClient } from './baseClient.js';
import type { WebSocketEventType } from './interfaces';
/**
 * WebSocketClient handles real-time communication with the Asterisk server.
 * Extends EventEmitter to provide event-based communication patterns.
 */
export declare class WebSocketClient extends EventEmitter {
    private readonly baseClient;
    private apps;
    private subscribedEvents?;
    private readonly ariClient?;
    private ws?;
    private isReconnecting;
    private isConnecting;
    private shouldReconnect;
    private readonly maxReconnectAttempts;
    private reconnectionAttempts;
    private lastWsUrl;
    private eventQueue;
    /**
     * Logs the current connection status of the WebSocket client at regular intervals.
     *
     * This method sets up an interval that logs various connection-related metrics every 60 seconds.
     * The logged information includes:
     * - The number of active connections (0 or 1)
     * - The current state of the WebSocket connection
     * - The number of reconnection attempts made
     * - The size of the event queue
     *
     * This can be useful for monitoring the health and status of the WebSocket connection over time.
     *
     * @private
     * @returns {void}
     */
    private logConnectionStatus;
    /**
     * Sets up a heartbeat mechanism for the WebSocket connection.
     *
     * This method creates an interval that sends a ping message every 30 seconds
     * to keep the connection alive. The heartbeat is automatically cleared when
     * the WebSocket connection is closed.
     *
     * @private
     * @returns {void}
     */
    private setupHeartbeat;
    private readonly backOffOptions;
    /**
     * Creates a new WebSocketClient instance.
     *
     * This constructor initializes a WebSocketClient with the necessary dependencies and configuration.
     * It ensures that at least one application name is provided.
     *
     * @param baseClient - The BaseClient instance used for basic ARI operations and authentication.
     * @param apps - An array of application names to connect to via the WebSocket.
     * @param subscribedEvents - Optional. An array of WebSocketEventTypes to subscribe to. If not provided, all events will be subscribed.
     * @param ariClient - Optional. The AriClient instance, used for creating Channel and Playback instances when processing events.
     *
     * @throws {Error} Throws an error if the apps array is empty.
     */
    constructor(baseClient: BaseClient, apps: string[], subscribedEvents?: WebSocketEventType[] | undefined, ariClient?: AriClient | undefined);
    /**
     * Establishes a WebSocket connection to the Asterisk server.
     *
     * This method constructs the WebSocket URL using the base URL, credentials,
     * application names, and subscribed events. It then initiates the connection
     * using the constructed URL.
     *
     * @returns A Promise that resolves when the WebSocket connection is successfully established.
     * @throws Will throw an error if the connection cannot be established.
     */
    connect(): Promise<void>;
    /**
     * Reconecta o WebSocket com uma lista atualizada de aplicações.
     *
     * @param {string[]} newApps - Lista de aplicações para reconectar
     * @param {WebSocketEventType[]} [subscribedEvents] - Tipos de eventos para se inscrever (opcional)
     * @returns {Promise<void>} Promise resolvida quando reconectado com sucesso
     */
    reconnectWithApps(newApps: string[], subscribedEvents?: WebSocketEventType[]): Promise<void>;
    /**
     * Adiciona novas aplicações à conexão WebSocket existente.
     *
     * @param {string[]} newApps - Lista de novas aplicações para adicionar
     * @param {WebSocketEventType[]} [subscribedEvents] - Tipos de eventos para se inscrever (opcional)
     * @returns {Promise<void>} Promise resolvida quando as aplicações são adicionadas com sucesso
     */
    addApps(newApps: string[], subscribedEvents?: WebSocketEventType[]): Promise<void>;
    /**
     * Initializes a WebSocket connection with exponential backoff retry mechanism.
     *
     * This method attempts to establish a WebSocket connection to the specified URL.
     * It sets up event listeners for the WebSocket's 'open', 'message', 'close', and 'error' events.
     * If the connection is successful, it emits a 'connected' event. If it's a reconnection,
     * it also emits a 'reconnected' event with the current apps and subscribed events.
     * In case of connection failure, it uses an exponential backoff strategy to retry.
     *
     * @param wsUrl - The WebSocket URL to connect to.
     * @returns A Promise that resolves when the connection is successfully established,
     *          or rejects if an error occurs during the connection process.
     * @throws Will throw an error if the WebSocket connection cannot be established
     *         after the maximum number of retry attempts.
     */
    private initializeWebSocket;
    private getEventKey;
    private processEvent;
    /**
     * Handles incoming WebSocket messages by parsing and processing events.
     *
     * This method parses the raw message into a WebSocketEvent, filters it based on
     * subscribed events (if any), processes channel and playback events, and emits
     * the event to listeners. It also handles any errors that occur during processing.
     *
     * @param rawMessage - The raw message string received from the WebSocket connection.
     * @returns void This method doesn't return a value but emits events.
     *
     * @throws Will emit an 'error' event if the message cannot be parsed or processed.
     */
    private handleMessage;
    /**
     * Attempts to reconnect to the WebSocket server using an exponential backoff strategy.
     *
     * This method is called when the WebSocket connection is closed unexpectedly.
     * It increments the reconnection attempt counter, logs the attempt, and uses
     * the backOff utility to retry the connection with exponential delays between attempts.
     *
     * @param wsUrl - The WebSocket URL to reconnect to.
     * @returns void - This method doesn't return a value.
     *
     * @emits reconnectFailed - Emitted if all reconnection attempts fail.
     */
    private reconnect;
    /**
     * Closes the WebSocket connection if it exists.
     *
     * This method attempts to gracefully close the WebSocket connection
     * and sets the WebSocket instance to undefined. If an error occurs
     * during the closing process, it will be caught and logged.
     *
     * @throws {Error} Logs an error message if closing the WebSocket fails.
     */
    close(): Promise<void>;
    /**
     * Checks if the WebSocket connection is currently open and active.
     *
     * This method provides a way to determine the current state of the WebSocket connection.
     * It checks if the WebSocket's readyState property is equal to WebSocket.OPEN,
     * which indicates an active connection.
     *
     * @returns {boolean} True if the WebSocket connection is open and active, false otherwise.
     */
    isConnected(): boolean;
    /**
     * Retrieves the current state of the WebSocket connection.
     *
     * This method provides a way to check the current state of the WebSocket connection.
     * It returns a number corresponding to one of the WebSocket readyState values:
     * - 0 (CONNECTING): The connection is not yet open.
     * - 1 (OPEN): The connection is open and ready to communicate.
     * - 2 (CLOSING): The connection is in the process of closing.
     * - 3 (CLOSED): The connection is closed or couldn't be opened.
     *
     * If the WebSocket instance doesn't exist, it returns WebSocket.CLOSED (3).
     *
     * @returns {number} A number representing the current state of the WebSocket connection.
     */
    getState(): number;
    /**
     * Cleans up the WebSocketClient instance, resetting its state and clearing resources.
     *
     * This method performs the following cleanup operations:
     * - Clears the event queue and cancels any pending timeouts.
     * - Stops any ongoing reconnection attempts.
     * - Clears the stored WebSocket URL.
     * - Resets the reconnection attempt counter.
     * - Removes all event listeners attached to this instance.
     *
     * This method is typically called when the WebSocketClient is no longer needed or
     * before reinitializing the client to ensure a clean slate.
     *
     * @returns {void} This method doesn't return a value.
     */
    cleanup(): void;
}
//# sourceMappingURL=websocketClient.d.ts.map