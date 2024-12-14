import { EventEmitter } from "events";
import { isAxiosError } from "axios";
import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type { Playback, WebSocketEvent } from "../interfaces";

/**
 * Utility function to extract error message
 * @param error - The error object to process
 * @returns A formatted error message
 */
const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "An axios error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

/**
 * Represents a playback instance that provides methods for controlling media playback,
 * managing event listeners, and handling playback state.
 */
export class PlaybackInstance {
  private readonly eventEmitter = new EventEmitter();
  private playbackData: Playback | null = null;
  public readonly id: string;

  /**
   * Creates a new PlaybackInstance.
   *
   * @param {AriClient} client - ARI client for communication
   * @param {BaseClient} baseClient - Base client for HTTP requests
   * @param {string} [playbackId] - Optional playback ID, generates timestamp-based ID if not provided
   */
  constructor(
    private readonly client: AriClient,
    private readonly baseClient: BaseClient,
    private readonly playbackId: string = `playback-${Date.now()}`,
  ) {
    this.id = playbackId;
    console.log(`PlaybackInstance initialized with ID: ${this.id}`);
  }

  /**
   * Registers an event listener for a specific WebSocket event type.
   *
   * @param {T} event - Event type to listen for
   * @param {Function} listener - Callback function for the event
   */
  on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
    console.log(
      `Event listener registered for ${event} on playback ${this.id}`,
    );
  }

  /**
   * Registers a one-time event listener for a specific WebSocket event type.
   *
   * @param {T} event - Event type to listen for
   * @param {Function} listener - Callback function for the event
   */
  once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
    console.log(
      `One-time event listener registered for ${event} on playback ${this.id}`,
    );
  }

  /**
   * Removes event listener(s) for a specific WebSocket event type.
   *
   * @param {T} event - Event type to remove listener(s) for
   * @param {Function} [listener] - Optional specific listener to remove
   */
  off<T extends WebSocketEvent["type"]>(
    event: T,
    listener?: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    if (listener) {
      this.eventEmitter.off(event, listener);
      console.log(
        `Specific listener removed for ${event} on playback ${this.id}`,
      );
    } else {
      this.eventEmitter.removeAllListeners(event);
      console.log(`All listeners removed for ${event} on playback ${this.id}`);
    }
  }

  /**
   * Emits a WebSocket event if it matches the current playback instance.
   *
   * @param {WebSocketEvent} event - Event to emit
   */
  emitEvent(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Received invalid event");
      return;
    }

    if ("playback" in event && event.playback?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
      console.log(`Event ${event.type} emitted for playback ${this.id}`);
    }
  }

  /**
   * Retrieves current playback data.
   *
   * @returns {Promise<Playback>} Current playback data
   * @throws {Error} If playback is not properly initialized
   */
  async get(): Promise<Playback> {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }

    try {
      this.playbackData = await this.baseClient.get<Playback>(
        `/playbacks/${this.id}`,
      );
      console.log(`Retrieved playback data for ${this.id}`);
      return this.playbackData;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error retrieving playback data for ${this.id}:`, message);
      throw new Error(`Failed to get playback data: ${message}`);
    }
  }

  /**
   * Controls playback with specified operation.
   *
   * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Control operation to perform
   * @throws {Error} If playback is not properly initialized or operation fails
   */
  async control(
    operation: "pause" | "unpause" | "reverse" | "forward",
  ): Promise<void> {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }

    try {
      await this.baseClient.post<void>(
        `/playbacks/${this.id}/control?operation=${operation}`,
      );
      console.log(
        `Operation ${operation} executed successfully on playback ${this.id}`,
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error controlling playback ${this.id}:`, message);
      throw new Error(`Failed to control playback: ${message}`);
    }
  }

  /**
   * Stops the current playback.
   *
   * @throws {Error} If playback is not properly initialized or stop operation fails
   */
  async stop(): Promise<void> {
    if (!this.id) {
      throw new Error("No playback associated with this instance");
    }

    try {
      await this.baseClient.delete<void>(`/playbacks/${this.id}`);
      console.log(`Playback ${this.id} stopped successfully`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error stopping playback ${this.id}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }

  /**
   * Removes all event listeners from this playback instance.
   */
  removeAllListeners(): void {
    this.eventEmitter.removeAllListeners();
    console.log(`All listeners removed from playback ${this.id}`);
  }

  /**
   * Checks if the playback instance has any listeners for a specific event.
   *
   * @param {string} event - Event type to check
   * @returns {boolean} True if there are listeners for the event
   */
  hasListeners(event: string): boolean {
    return this.eventEmitter.listenerCount(event) > 0;
  }

  /**
   * Gets the current playback data without making an API call.
   *
   * @returns {Playback | null} Current playback data or null if not available
   */
  getCurrentData(): Playback | null {
    return this.playbackData;
  }
}

/**
 * Manages playback instances and their related operations in the Asterisk REST Interface.
 * This class provides functionality to create, control, and manage playback instances,
 * as well as handle WebSocket events related to playbacks.
 */
export class Playbacks {
  private playbackInstances = new Map<string, PlaybackInstance>();

  constructor(
    private baseClient: BaseClient,
    private client: AriClient,
  ) {}

  /**
   * Gets or creates a playback instance
   * @param {Object} [params] - Optional parameters for getting/creating a playback instance
   * @param {string} [params.id] - Optional ID of an existing playback
   * @returns {PlaybackInstance} The requested or new playback instance
   */
  Playback(params?: { id?: string }): PlaybackInstance {
    try {
      const id = params?.id;

      if (!id) {
        const instance = new PlaybackInstance(this.client, this.baseClient);
        this.playbackInstances.set(instance.id, instance);
        console.log(`New playback instance created with ID: ${instance.id}`);
        return instance;
      }

      if (!this.playbackInstances.has(id)) {
        const instance = new PlaybackInstance(this.client, this.baseClient, id);
        this.playbackInstances.set(id, instance);
        console.log(`New playback instance created with provided ID: ${id}`);
        return instance;
      }

      console.log(`Returning existing playback instance: ${id}`);
      return this.playbackInstances.get(id)!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error creating/retrieving playback instance:`, message);
      throw new Error(`Failed to manage playback instance: ${message}`);
    }
  }

  /**
   * Removes a playback instance and cleans up its resources
   * @param {string} playbackId - ID of the playback instance to remove
   * @throws {Error} If the playback instance doesn't exist
   */
  removePlaybackInstance(playbackId: string): void {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    if (this.playbackInstances.has(playbackId)) {
      const instance = this.playbackInstances.get(playbackId);
      instance?.removeAllListeners();
      this.playbackInstances.delete(playbackId);
      console.log(`Playback instance removed: ${playbackId}`);
    } else {
      console.warn(`Attempt to remove non-existent instance: ${playbackId}`);
    }
  }

  /**
   * Propagates WebSocket events to the corresponding playback instance
   * @param {WebSocketEvent} event - The WebSocket event to propagate
   */
  propagateEventToPlayback(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Invalid WebSocket event received");
      return;
    }

    if ("playback" in event && event.playback?.id) {
      const instance = this.playbackInstances.get(event.playback.id);
      if (instance) {
        instance.emitEvent(event);
        console.log(
          `Event propagated to playback ${event.playback.id}: ${event.type}`,
        );
      } else {
        console.warn(`No instance found for playback ${event.playback.id}`);
      }
    }
  }

  /**
   * Retrieves details of a specific playback
   * @param {string} playbackId - ID of the playback to get details for
   * @returns {Promise<Playback>} Promise resolving to playback details
   * @throws {Error} If the playback ID is invalid or the request fails
   */
  async getDetails(playbackId: string): Promise<Playback> {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    try {
      return await this.baseClient.get<Playback>(`/playbacks/${playbackId}`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error getting playback details ${playbackId}:`, message);
      throw new Error(`Failed to get playback details: ${message}`);
    }
  }

  /**
   * Controls a specific playback instance
   * @param {string} playbackId - ID of the playback to control
   * @param {"pause" | "unpause" | "reverse" | "forward"} operation - Operation to perform
   * @throws {Error} If the playback ID is invalid or the operation fails
   */
  async control(
    playbackId: string,
    operation: "pause" | "unpause" | "reverse" | "forward",
  ): Promise<void> {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    try {
      const playback = this.Playback({ id: playbackId });
      await playback.control(operation);
      console.log(`Operation ${operation} executed on playback ${playbackId}`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error controlling playback ${playbackId}:`, message);
      throw new Error(`Failed to control playback: ${message}`);
    }
  }

  /**
   * Stops a specific playback instance
   * @param {string} playbackId - ID of the playback to stop
   * @throws {Error} If the playback ID is invalid or the stop operation fails
   */
  async stop(playbackId: string): Promise<void> {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    try {
      const playback = this.Playback({ id: playbackId });
      await playback.stop();
      console.log(`Playback ${playbackId} stopped`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error stopping playback ${playbackId}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }

  /**
   * Gets the count of active playback instances
   * @returns {number} Number of active playback instances
   */
  getInstanceCount(): number {
    return this.playbackInstances.size;
  }

  /**
   * Checks if a playback instance exists
   * @param {string} playbackId - ID of the playback to check
   * @returns {boolean} True if the playback instance exists
   */
  hasInstance(playbackId: string): boolean {
    return this.playbackInstances.has(playbackId);
  }
}
