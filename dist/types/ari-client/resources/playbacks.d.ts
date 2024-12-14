import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Playback, WebSocketEvent } from "../interfaces";
/**
 * Represents a playback instance that provides methods for controlling media playback,
 * managing event listeners, and handling playback state.
 */
export declare class PlaybackInstance {
    private readonly client;
    private readonly baseClient;
    private readonly playbackId;
    private readonly eventEmitter;
    private playbackData;
    readonly id: string;
    /**
     * Creates a new PlaybackInstance.
     *
     * @param {AriClient} client - ARI client for communication
     * @param {BaseClient} baseClient - Base client for HTTP requests
     * @param {string} [playbackId] - Optional playback ID, generates timestamp-based ID if not provided
     */
    constructor(client: AriClient, baseClient: BaseClient, playbackId?: string);
    /**
     * Registers an event listener for a specific WebSocket event type.
     *
     * @param {T} event - Event type to listen for
     * @param {Function} listener - Callback function for the event
     */
    on<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Registers a one-time event listener for a specific WebSocket event type.
     *
     * @param {T} event - Event type to listen for
     * @param {Function} listener - Callback function for the event
     */
    once<T extends WebSocketEvent["type"]>(event: T, listener: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Removes event listener(s) for a specific WebSocket event type.
     *
     * @param {T} event - Event type to remove listener(s) for
     * @param {Function} [listener] - Optional specific listener to remove
     */
    off<T extends WebSocketEvent["type"]>(event: T, listener?: (data: Extract<WebSocketEvent, {
        type: T;
    }>) => void): void;
    /**
     * Emits a WebSocket event if it matches the current playback instance.
     *
     * @param {WebSocketEvent} event - Event to emit
     */
    emitEvent(event: WebSocketEvent): void;
    /**
     * Retrieves current playback data.
     *
     * @returns {Promise<Playback>} Current playback data
     * @throws {Error} If playback is not properly initialized
     */
    get(): Promise<Playback>;
    /**
     * Controls playback with specified operation.
     *
     * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Control operation to perform
     * @throws {Error} If playback is not properly initialized or operation fails
     */
    control(operation: "pause" | "unpause" | "reverse" | "forward"): Promise<void>;
    /**
     * Stops the current playback.
     *
     * @throws {Error} If playback is not properly initialized or stop operation fails
     */
    stop(): Promise<void>;
    /**
     * Removes all event listeners from this playback instance.
     */
    removeAllListeners(): void;
    /**
     * Checks if the playback instance has any listeners for a specific event.
     *
     * @param {string} event - Event type to check
     * @returns {boolean} True if there are listeners for the event
     */
    hasListeners(event: string): boolean;
    /**
     * Gets the current playback data without making an API call.
     *
     * @returns {Playback | null} Current playback data or null if not available
     */
    getCurrentData(): Playback | null;
}
/**
 * Manages playback instances and their related operations in the Asterisk REST Interface.
 * This class provides functionality to create, control, and manage playback instances,
 * as well as handle WebSocket events related to playbacks.
 */
export declare class Playbacks {
    private baseClient;
    private client;
    private playbackInstances;
    constructor(baseClient: BaseClient, client: AriClient);
    /**
     * Gets or creates a playback instance
     * @param {Object} params - Parameters for getting/creating a playback instance
     * @param {string} [params.id] - Optional ID of an existing playback
     * @returns {PlaybackInstance} The requested or new playback instance
     */
    Playback({ id }: {
        id?: string;
    }): PlaybackInstance;
    /**
     * Removes a playback instance and cleans up its resources
     * @param {string} playbackId - ID of the playback instance to remove
     * @throws {Error} If the playback instance doesn't exist
     */
    removePlaybackInstance(playbackId: string): void;
    /**
     * Propagates WebSocket events to the corresponding playback instance
     * @param {WebSocketEvent} event - The WebSocket event to propagate
     */
    propagateEventToPlayback(event: WebSocketEvent): void;
    /**
     * Retrieves details of a specific playback
     * @param {string} playbackId - ID of the playback to get details for
     * @returns {Promise<Playback>} Promise resolving to playback details
     * @throws {Error} If the playback ID is invalid or the request fails
     */
    getDetails(playbackId: string): Promise<Playback>;
    /**
     * Controls a specific playback instance
     * @param {string} playbackId - ID of the playback to control
     * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Operation to perform
     * @throws {Error} If the playback ID is invalid or the operation fails
     */
    control(playbackId: string, operation: "pause" | "unpause" | "reverse" | "forward"): Promise<void>;
    /**
     * Stops a specific playback instance
     * @param {string} playbackId - ID of the playback to stop
     * @throws {Error} If the playback ID is invalid or the stop operation fails
     */
    stop(playbackId: string): Promise<void>;
    /**
     * Gets the count of active playback instances
     * @returns {number} Number of active playback instances
     */
    getInstanceCount(): number;
    /**
     * Checks if a playback instance exists
     * @param {string} playbackId - ID of the playback to check
     * @returns {boolean} True if the playback instance exists
     */
    hasInstance(playbackId: string): boolean;
}
//# sourceMappingURL=playbacks.d.ts.map