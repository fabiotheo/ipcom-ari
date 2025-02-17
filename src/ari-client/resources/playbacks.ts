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
  private readonly listenersMap = new Map<string, Function[]>(); // 🔹 Guarda listeners para remoção posterior
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

    // 🔹 Verifica se o listener já está registrado para evitar duplicação
    const existingListeners = this.listenersMap.get(event) || [];
    if (existingListeners.includes(listener)) {
      console.warn(
        `Listener já registrado para evento ${event}, reutilizando.`,
      );
      return;
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };

    this.eventEmitter.on(event, wrappedListener);

    // 🔹 Armazena o listener para futura remoção
    if (!this.listenersMap.has(event)) {
      this.listenersMap.set(event, []);
    }
    this.listenersMap.get(event)!.push(wrappedListener);
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

    const eventKey = `${event}-${this.id}`;

    // 🔹 Verifica se já existe um listener igual para evitar duplicação
    const existingListeners = this.listenersMap.get(eventKey) || [];
    if (existingListeners.includes(listener)) {
      console.warn(
        `One-time listener já registrado para evento ${eventKey}, reutilizando.`,
      );
      return;
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("playback" in data && data.playback?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);

        // 🔹 Remove automaticamente o listener após a primeira execução
        this.off(event, wrappedListener);
      }
    };

    this.eventEmitter.once(event, wrappedListener);

    // 🔹 Armazena o listener para futura remoção
    if (!this.listenersMap.has(eventKey)) {
      this.listenersMap.set(eventKey, []);
    }
    this.listenersMap.get(eventKey)!.push(wrappedListener);
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
      const storedListeners = this.listenersMap.get(event) || [];
      this.listenersMap.set(
        event,
        storedListeners.filter((l) => l !== listener),
      );
    } else {
      this.eventEmitter.removeAllListeners(event);
      this.listenersMap.delete(event);
    }
  }

  /**
   * Cleans up the PlaybackInstance, resetting its state and clearing resources.
   */
  public cleanup(): void {
    // Limpar dados do playback
    this.playbackData = null;

    // Remover todos os listeners
    this.removeAllListeners();

    // Limpar o map de listeners
    this.listenersMap.clear();

    console.log(`Playback instance ${this.id} cleaned up`);
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
      return this.playbackData;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error retrieving playback data for ${this.id}:`, message);
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
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error controlling playback ${this.id}:`, message);
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
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error stopping playback ${this.id}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }

  /**
   * Removes all event listeners associated with this playback instance.
   * This method clears both the internal listener map and the event emitter.
   *
   * @remarks
   * This method performs the following actions:
   * 1. Logs a message indicating the removal of listeners.
   * 2. Iterates through all stored listeners and removes them from the event emitter.
   * 3. Clears the internal listener map.
   * 4. Removes all listeners from the event emitter.
   *
   * @returns {void} This method doesn't return a value.
   */
  removeAllListeners(): void {
    console.log(`Removing all event listeners for playback ${this.id}`);
    this.listenersMap.forEach((listeners, event) => {
      listeners.forEach((listener) => {
        this.eventEmitter.off(
          event as string,
          listener as (...args: any[]) => void,
        );
      });
    });

    this.listenersMap.clear();
    this.eventEmitter.removeAllListeners();
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
  private eventQueue = new Map<string, NodeJS.Timeout>();

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
        return instance;
      }

      if (!this.playbackInstances.has(id)) {
        const instance = new PlaybackInstance(this.client, this.baseClient, id);
        this.playbackInstances.set(id, instance);
        return instance;
      }

      return this.playbackInstances.get(id)!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error creating/retrieving playback instance:`, message);
      throw new Error(`Failed to manage playback instance: ${message}`);
    }
  }

  /**
   * Cleans up resources associated with the Playbacks instance.
   * This method performs the following cleanup operations:
   * 1. Clears all pending timeouts in the event queue.
   * 2. Removes all playback instances.
   * 
   * @remarks
   * This method should be called when the Playbacks instance is no longer needed
   * to ensure proper resource management and prevent memory leaks.
   * 
   * @returns {void} This method doesn't return a value.
   */
  public cleanup(): void {
    // Limpar event queue
    this.eventQueue.forEach((timeout) => clearTimeout(timeout));
    this.eventQueue.clear();
  
    // Limpar todas as instâncias
    this.remove();
  }

  /**
   * Removes all playback instances and cleans up their resources.
   */
  public remove(): void {
    // Salvar os IDs antes de começar a limpeza
    const playbackIds = Array.from(this.playbackInstances.keys());

    for (const playbackId of playbackIds) {
      try {
        const instance = this.playbackInstances.get(playbackId);
        if (instance) {
          instance.cleanup(); // Usar o novo método cleanup
          this.playbackInstances.delete(playbackId);
          console.log(`Playback instance ${playbackId} removed and cleaned up`);
        }
      } catch (error) {
        console.error(`Error cleaning up playback ${playbackId}:`, error);
      }
    }

    // Garantir que o map está vazio
    this.playbackInstances.clear();
    console.log("All playback instances have been removed and cleaned up");
  }

  /**
   * Removes a playback instance and cleans up its resources
   * @param {string} playbackId - ID of the playback instance to remove
   * @throws {Error} If the playback instance doesn't exist
   */
  public removePlaybackInstance(playbackId: string): void {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    const instance = this.playbackInstances.get(playbackId);
    if (instance) {
      try {
        instance.cleanup();
        this.playbackInstances.delete(playbackId);
        console.log(`Playback instance ${playbackId} removed from memory`);
      } catch (error) {
        console.error(`Error removing playback instance ${playbackId}:`, error);
        throw error;
      }
    } else {
      console.warn(`Attempt to remove non-existent instance: ${playbackId}`);
    }
  }

  /**
   * Propagates WebSocket events to the corresponding playback instance
   * @param {WebSocketEvent} event - The WebSocket event to propagate
   */
  public propagateEventToPlayback(event: WebSocketEvent): void {
    if (!event || !("playback" in event) || !event.playback?.id) {
      console.warn("Invalid WebSocket event received");
      return;
    }

    const key = `${event.type}-${event.playback.id}`;
    const existing = this.eventQueue.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    this.eventQueue.set(
      key,
      setTimeout(() => {
        const instance = this.playbackInstances.get(event.playback!.id!);
        if (instance) {
          instance.emitEvent(event);
        } else {
          console.warn(
            `No instance found for playback ${event.playback!.id}. Event ignored.`,
          );
        }
        this.eventQueue.delete(key);
      }, 100),
    );
  }

  /**
   * Retrieves details of a specific playback
   * @param {string} playbackId - ID of the playback to get details for
   * @returns {Promise<Playback>} Promise resolving to playback details
   * @throws {Error} If the playback ID is invalid or the request fails
   */
  async get(playbackId: string): Promise<Playback> {
    if (!playbackId) {
      throw new Error("Playback ID is required");
    }

    try {
      return await this.baseClient.get<Playback>(`/playbacks/${playbackId}`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error getting playback details ${playbackId}:`, message);
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
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error controlling playback ${playbackId}:`, message);
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
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.warn(`Error stopping playback ${playbackId}:`, message);
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
