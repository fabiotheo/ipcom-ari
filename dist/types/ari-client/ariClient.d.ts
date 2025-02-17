import type { AriClientConfig, WebSocketEvent, WebSocketEventType } from "./interfaces";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { type BridgeInstance, Bridges } from "./resources/bridges";
import { type ChannelInstance, Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { type PlaybackInstance, Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
/**
 * Main client class for interacting with the Asterisk REST Interface (ARI).
 * Provides access to various ARI resources and WebSocket event handling capabilities.
 *
 * @example
 * ```typescript
 * const client = new AriClient({
 *   host: 'localhost',
 *   port: 8088,
 *   username: 'user',
 *   password: 'secret'
 * });
 * ```
 */
export declare class AriClient {
    private readonly config;
    private readonly baseClient;
    private webSocketClient?;
    private eventListeners;
    readonly channels: Channels;
    readonly endpoints: Endpoints;
    readonly applications: Applications;
    readonly playbacks: Playbacks;
    readonly sounds: Sounds;
    readonly asterisk: Asterisk;
    readonly bridges: Bridges;
    /**
     * Creates a new instance of the ARI client.
     *
     * @param {AriClientConfig} config - Configuration options for the ARI client
     * @throws {Error} If required configuration parameters are missing
     */
    constructor(config: AriClientConfig);
    cleanup(): Promise<void>;
    /**
     * Initializes a WebSocket connection for receiving events.
     *
     * @param {string[]} apps - List of application names to subscribe to
     * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of specific event types to subscribe to
     * @returns {Promise<void>} Resolves when connection is established
     * @throws {Error} If connection fails or if WebSocket is already connected
     */
    connectWebSocket(apps: string[], subscribedEvents?: WebSocketEventType[]): Promise<void>;
    /**
     * Destroys the ARI Client instance, cleaning up all resources and removing circular references.
     * This method should be called when the ARI Client is no longer needed to ensure proper cleanup.
     *
     * @returns {Promise<void>} A promise that resolves when the destruction process is complete.
     * @throws {Error} If an error occurs during the destruction process.
     */
    destroy(): Promise<void>;
    /**
     * Registers an event listener for WebSocket events.
     *
     * @param {T} event - The event type to listen for
     * @param {Function} listener - Callback function for handling the event
     * @throws {Error} If WebSocket is not connected
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Registers a one-time event listener for WebSocket events.
     *
     * @param {T} event - The event type to listen for
     * @param {Function} listener - Callback function for handling the event
     * @throws {Error} If WebSocket is not connected
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Removes an event listener for WebSocket events.
     *
     * @param {T} event - The event type to remove listener for
     * @param {Function} listener - The listener function to remove
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Closes the WebSocket connection if one exists.
     */
    closeWebSocket(): Promise<void>;
    /**
     * Creates or retrieves a Channel instance.
     *
     * @param {string} [channelId] - Optional ID of an existing channel
     * @returns {ChannelInstance} A new or existing channel instance
     */
    Channel(channelId?: string): ChannelInstance;
    /**
     * Creates or retrieves a Playback instance.
     *
     * @param {string} [playbackId] - Optional ID of an existing playback
     * @param {string} [_app] - Optional application name (deprecated)
     * @returns {PlaybackInstance} A new or existing playback instance
     */
    Playback(playbackId?: string, _app?: string): PlaybackInstance;
    /**
     * Creates or retrieves a Bridge instance.
     *
     * This function allows you to create a new Bridge instance or retrieve an existing one
     * based on the provided bridge ID.
     *
     * @param {string} [bridgeId] - Optional ID of an existing bridge. If provided, retrieves the
     *                               existing bridge with this ID. If omitted, creates a new bridge.
     * @returns {BridgeInstance} A new or existing Bridge instance that can be used to interact
     *                           with the Asterisk bridge.
     */
    Bridge(bridgeId?: string): BridgeInstance;
    /**
     * Gets the current WebSocket connection status.
     *
     * @returns {boolean} True if WebSocket is connected, false otherwise
     */
    isWebSocketConnected(): boolean;
}
//# sourceMappingURL=ariClient.d.ts.map