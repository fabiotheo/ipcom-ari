import { EventEmitter } from "events";
import { isAxiosError } from "axios";
import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type {
  AddChannelRequest,
  Bridge,
  BridgePlayback,
  CreateBridgeRequest,
  PlayMediaRequest,
  RemoveChannelRequest,
  WebSocketEvent,
} from "../interfaces";
import { bridgeEvents } from "../interfaces/events.types";
import { toQueryParams } from "../utils";

/**
 * Extracts an error message from various error types.
 *
 * This utility function attempts to retrieve the most relevant error message
 * from different error objects, including Axios errors and standard Error instances.
 *
 * @param error - The error object to extract the message from.
 *                Can be of type AxiosError, Error, or any unknown type.
 *
 * @returns A string containing the extracted error message.
 *          For Axios errors, it prioritizes the response data message,
 *          then falls back to the error message, and finally a default Axios error message.
 *          For standard Error instances, it returns the error message.
 *          For unknown error types, it returns a generic error message.
 */
const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Um erro do axios ocorreu"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Um erro desconhecido ocorreu";
};

/**
 * Represents an instance of a Bridge that provides methods to control
 * bridges, manage event listeners, and manipulate its state.
 */
export class BridgeInstance {
  private readonly eventEmitter = new EventEmitter();
  private bridgeData: Bridge | null = null;
  public readonly id: string;

  /**
   * Creates a new BridgeInstance.
   *
   * @param client - The AriClient instance for making API calls.
   * @param baseClient - The BaseClient instance for making HTTP requests.
   * @param bridgeId - Optional. The ID of the bridge. If not provided, a new ID will be generated.
   */
  constructor(
    private readonly client: AriClient,
    private readonly baseClient: BaseClient,
    bridgeId?: string,
  ) {
    this.id = bridgeId || `bridge-${Date.now()}`;
  }

  /**
   * Registers a listener for specific bridge events.
   *
   * @param event - The type of event to listen for.
   * @param listener - The callback function to be called when the event occurs.
   */
  /**
   * Registers a listener for specific bridge events.
   *
   * This method allows you to attach an event listener to the bridge instance for a specific event type.
   * When the specified event occurs, the provided listener function will be called with the event data.
   *
   * @template T - The specific type of WebSocketEvent to listen for.
   *                               It receives the event data as its parameter.
   * @returns {void}
   *
   * @example
   * bridge.on('BridgeCreated', (event) => {
   *
   * });
   * @param event
   * @param listener
   */
  on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("bridge" in data && data.bridge?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
  }

  /**
   * Registers a one-time listener for specific bridge events.
   *
   * @param event - The type of event to listen for.
   * @param listener - The callback function to be called when the event occurs.
   */
  once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("bridge" in data && data.bridge?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
  }

  /**
   * Removes event listener(s) from the bridge.
   *
   * @param event - The type of event to remove listeners for.
   * @param listener - Optional. The specific listener to remove. If not provided, all listeners for the event will be removed.
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
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
  }

  /**
   * Emits an event if it corresponds to the current bridge.
   *
   * @param event - The WebSocketEvent to emit.
   */
  emitEvent(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Invalid event received");
      return;
    }

    if ("bridge" in event && event.bridge?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
    }
  }

  /**
   * Removes all event listeners from this bridge instance.
   */
  removeAllListeners(): void {
    this.eventEmitter.removeAllListeners();
  }

  /**
   * Retrieves the current details of the bridge.
   *
   * @returns A Promise that resolves to the Bridge object containing the current details.
   * @throws An error if the retrieval fails.
   */
  async get(): Promise<Bridge> {
    try {
      if (!this.id) {
        throw new Error("No bridge associated with this instance");
      }

      this.bridgeData = await this.baseClient.get<Bridge>(
        `/bridges/${this.id}`,
      );
      return this.bridgeData;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error retrieving details for bridge ${this.id}:`, message);
      throw new Error(`Failed to get bridge details: ${message}`);
    }
  }

  /**
   * Adds channels to the bridge.
   *
   * @param request - The AddChannelRequest object containing the channels to add.
   * @throws An error if the operation fails.
   */
  async add(request: AddChannelRequest): Promise<void> {
    try {
      const queryParams = toQueryParams({
        channel: Array.isArray(request.channel)
          ? request.channel.join(",")
          : request.channel,
        ...(request.role && { role: request.role }),
      });

      await this.baseClient.post<void>(
        `/bridges/${this.id}/addChannel?${queryParams}`,
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error adding channels to bridge ${this.id}:`, message);
      throw new Error(`Failed to add channels: ${message}`);
    }
  }

  /**
   * Removes channels from the bridge.
   *
   * @param request - The RemoveChannelRequest object containing the channels to remove.
   * @throws An error if the operation fails.
   */
  async remove(request: RemoveChannelRequest): Promise<void> {
    try {
      const queryParams = toQueryParams({
        channel: Array.isArray(request.channel)
          ? request.channel.join(",")
          : request.channel,
      });

      await this.baseClient.post<void>(
        `/bridges/${this.id}/removeChannel?${queryParams}`,
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error removing channels from bridge ${this.id}:`, message);
      throw new Error(`Failed to remove channels: ${message}`);
    }
  }

  /**
   * Plays media on the bridge.
   *
   * @param request - The PlayMediaRequest object containing the media details to play.
   * @returns A Promise that resolves to a BridgePlayback object.
   * @throws An error if the operation fails.
   */
  async playMedia(request: PlayMediaRequest): Promise<BridgePlayback> {
    try {
      const queryParams = new URLSearchParams({
        ...(request.lang && { lang: request.lang }),
        ...(request.offsetms && { offsetms: request.offsetms.toString() }),
        ...(request.skipms && { skipms: request.skipms.toString() }),
        ...(request.playbackId && { playbackId: request.playbackId }),
      }).toString();

      const result = await this.baseClient.post<BridgePlayback>(
        `/bridges/${this.id}/play?${queryParams}`,
        { media: request.media },
      );

      return result;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error playing media on bridge ${this.id}:`, message);
      throw new Error(`Failed to play media: ${message}`);
    }
  }

  /**
   * Stops media playback on the bridge.
   *
   * @param playbackId - The ID of the playback to stop.
   * @throws An error if the operation fails.
   */
  async stopPlayback(playbackId: string): Promise<void> {
    try {
      await this.baseClient.delete<void>(
        `/bridges/${this.id}/play/${playbackId}`,
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error stopping playback on bridge ${this.id}:`, message);
      throw new Error(`Failed to stop playback: ${message}`);
    }
  }

  /**
   * Sets the video source for the bridge.
   *
   * @param channelId - The ID of the channel to set as the video source.
   * @throws An error if the operation fails.
   */
  async setVideoSource(channelId: string): Promise<void> {
    try {
      await this.baseClient.post<void>(
        `/bridges/${this.id}/videoSource/${channelId}`,
      );
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(
        `Error setting video source for bridge ${this.id}:`,
        message,
      );
      throw new Error(`Failed to set video source: ${message}`);
    }
  }

  /**
   * Removes the video source from the bridge.
   *
   * @throws An error if the operation fails.
   */
  async clearVideoSource(): Promise<void> {
    try {
      await this.baseClient.delete<void>(`/bridges/${this.id}/videoSource`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(
        `Error removing video source from bridge ${this.id}:`,
        message,
      );
      throw new Error(`Failed to remove video source: ${message}`);
    }
  }

  /**
   * Checks if the bridge has listeners for a specific event.
   *
   * @param event - The event type to check for listeners.
   * @returns A boolean indicating whether there are listeners for the event.
   */
  hasListeners(event: string): boolean {
    return this.eventEmitter.listenerCount(event) > 0;
  }

  /**
   * Retrieves the current bridge data without making an API call.
   *
   * @returns The current Bridge object or null if no data is available.
   */
  getCurrentData(): Bridge | null {
    return this.bridgeData;
  }
}
export class Bridges {
  private readonly bridgeInstances = new Map<string, BridgeInstance>();
  constructor(
    private readonly baseClient: BaseClient,
    private readonly client: AriClient,
  ) {}
  /**
   * Creates or retrieves a Bridge instance.
   *
   * This method manages the creation and retrieval of BridgeInstance objects.
   * If an ID is provided and an instance with that ID already exists, it returns the existing instance.
   * If an ID is provided but no instance exists, it creates a new instance with that ID.
   * If no ID is provided, it creates a new instance with a generated ID.
   *
   * @param {Object} params - The parameters for creating or retrieving a Bridge instance.
   * @param {string} [params.id] - Optional. The ID of the Bridge instance to create or retrieve.
   *
   * @returns {BridgeInstance} A BridgeInstance object, either newly created or retrieved from existing instances.
   *
   * @throws {Error} If there's an error in creating or retrieving the Bridge instance.
   */
  Bridge({ id }: { id?: string }): BridgeInstance {
    try {
      if (!id) {
        const instance = new BridgeInstance(this.client, this.baseClient);
        this.bridgeInstances.set(instance.id, instance);

        return instance;
      }

      if (!this.bridgeInstances.has(id)) {
        const instance = new BridgeInstance(this.client, this.baseClient, id);
        this.bridgeInstances.set(id, instance);
        return instance;
      }

      return this.bridgeInstances.get(id)!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to manage bridge instance: ${message}`);
    }
  }

  /**
   * Removes a bridge instance from the collection of managed bridges.
   *
   * This function removes the specified bridge instance, cleans up its event listeners,
   * and logs the removal. If the bridge instance doesn't exist, it logs a warning.
   *
   * @param {string} bridgeId - The unique identifier of the bridge instance to be removed.
   * @throws {Error} Throws an error if the bridgeId is not provided.
   * @returns {void}
   */
  removeBridgeInstance(bridgeId: string): void {
    if (!bridgeId) {
      throw new Error("ID da bridge é obrigatório");
    }

    if (this.bridgeInstances.has(bridgeId)) {
      const instance = this.bridgeInstances.get(bridgeId);
      instance?.removeAllListeners();
      this.bridgeInstances.delete(bridgeId);
    } else {
      console.warn(`Tentativa de remover instância inexistente: ${bridgeId}`);
    }
  }

  /**
   * Propagates a WebSocket event to a specific bridge instance.
   *
   * This function checks if the received event is valid and related to a bridge,
   * then emits the event to the corresponding bridge instance if it exists.
   *
   * @param {WebSocketEvent} event - The WebSocket event to be propagated.
   *                                 This should be an object containing information about the event,
   *                                 including the bridge ID and event type.
   *
   * @returns {void}
   *
   * @remarks
   * - If the event is invalid (null or undefined), a warning is logged and the function returns early.
   * - The function checks if the event is bridge-related and if the event type is included in the predefined bridge events.
   * - If a matching bridge instance is found, the event is emitted to that instance.
   * - If no matching bridge instance is found, a warning is logged.
   */
  propagateEventToBridge(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Evento WebSocket inválido recebido");
      return;
    }

    if (
      "bridge" in event &&
      event.bridge?.id &&
      bridgeEvents.includes(event.type)
    ) {
      const instance = this.bridgeInstances.get(event.bridge.id);
      if (instance) {
        instance.emitEvent(event);
      } else {
        console.warn(
          `Nenhuma instância encontrada para bridge ${event.bridge.id}`,
        );
      }
    }
  }

  /**
   * Lists all active bridges in the system.
   *
   * This asynchronous function retrieves a list of all currently active bridges
   * by making a GET request to the "/bridges" endpoint using the base client.
   *
   * @returns {Promise<Bridge[]>} A promise that resolves to an array of Bridge objects.
   *                              Each Bridge object represents an active bridge in the system.
   *
   * @throws {Error} If there's an error in fetching the bridges or if the request fails.
   *
   * @example
   * try {
   *   const bridges = await bridgesInstance.list();
   *
   * } catch (error) {
   *   console.error('Failed to fetch bridges:', error);
   * }
   */
  async list(): Promise<Bridge[]> {
    return this.baseClient.get<Bridge[]>("/bridges");
  }

  /**
   * Creates a new bridge in the system.
   *
   * This asynchronous function sends a POST request to create a new bridge
   * using the provided configuration details.
   *
   * @param request - The configuration details for creating the new bridge.
   * @param request.type - The type of bridge to create (e.g., 'mixing', 'holding').
   * @param request.name - Optional. A custom name for the bridge.
   * @param request.bridgeId - Optional. A specific ID for the bridge. If not provided, one will be generated.
   *
   * @returns A Promise that resolves to a Bridge object representing the newly created bridge.
   *          The Bridge object contains details such as id, technology, bridge_type, bridge_class, channels, etc.
   *
   * @throws Will throw an error if the bridge creation fails or if there's a network issue.
   */
  async createBridge(request: CreateBridgeRequest): Promise<Bridge> {
    return this.baseClient.post<Bridge>("/bridges", request);
  }

  /**
   * Retrieves detailed information about a specific bridge.
   *
   * This asynchronous function fetches the complete details of a bridge
   * identified by its unique ID. It makes a GET request to the ARI endpoint
   * for the specified bridge.
   *
   * @param bridgeId - The unique identifier of the bridge to retrieve details for.
   *                   This should be a string that uniquely identifies the bridge in the system.
   *
   * @returns A Promise that resolves to a Bridge object containing all the details
   *          of the specified bridge. This includes information such as the bridge's
   *          ID, type, channels, and other relevant properties.
   *
   * @throws Will throw an error if the bridge cannot be found, if there's a network issue,
   *         or if the server responds with an error.
   */
  async get(bridgeId: string): Promise<Bridge> {
    return this.baseClient.get<Bridge>(`/bridges/${bridgeId}`);
  }

  /**
   * Destroys (deletes) a specific bridge in the system.
   *
   * This asynchronous function sends a DELETE request to remove a bridge
   * identified by its unique ID. Once destroyed, the bridge and all its
   * associated resources are permanently removed from the system.
   *
   * @param bridgeId - The unique identifier of the bridge to be destroyed.
   *                   This should be a string that uniquely identifies the bridge in the system.
   *
   * @returns A Promise that resolves to void when the bridge is successfully destroyed.
   *          If the operation is successful, the bridge no longer exists in the system.
   *
   * @throws Will throw an error if the bridge cannot be found, if there's a network issue,
   *         or if the server responds with an error during the deletion process.
   */
  async destroy(bridgeId: string): Promise<void> {
    return this.baseClient.delete<void>(`/bridges/${bridgeId}`);
  }

  /**
   * Adds one or more channels to a specified bridge.
   *
   * This asynchronous function sends a POST request to add channels to an existing bridge.
   * It can handle adding a single channel or multiple channels in one operation.
   *
   * @param bridgeId - The unique identifier of the bridge to which channels will be added.
   * @param request - An object containing the details of the channel(s) to be added.
   * @param request.channel - A single channel ID or an array of channel IDs to add to the bridge.
   * @param request.role - Optional. Specifies the role of the channel(s) in the bridge.
   *
   * @returns A Promise that resolves to void when the operation is successful.
   *
   * @throws Will throw an error if the request fails, such as if the bridge doesn't exist
   *         or if there's a network issue.
   */
  async addChannels(
    bridgeId: string,
    request: AddChannelRequest,
  ): Promise<void> {
    const queryParams = toQueryParams({
      channel: Array.isArray(request.channel)
        ? request.channel.join(",")
        : request.channel,
      ...(request.role && { role: request.role }),
    });

    await this.baseClient.post<void>(
      `/bridges/${bridgeId}/addChannel?${queryParams}`,
    );
  }

  /**
   * Removes one or more channels from a specified bridge.
   *
   * This asynchronous function sends a POST request to remove channels from an existing bridge.
   * It can handle removing a single channel or multiple channels in one operation.
   *
   * @param bridgeId - The unique identifier of the bridge from which channels will be removed.
   * @param request - An object containing the details of the channel(s) to be removed.
   * @param request.channel - A single channel ID or an array of channel IDs to remove from the bridge.
   *
   * @returns A Promise that resolves to void when the operation is successful.
   *
   * @throws Will throw an error if the request fails, such as if the bridge doesn't exist,
   *         if the channels are not in the bridge, or if there's a network issue.
   */
  async removeChannels(
    bridgeId: string,
    request: RemoveChannelRequest,
  ): Promise<void> {
    const queryParams = toQueryParams({
      channel: Array.isArray(request.channel)
        ? request.channel.join(",")
        : request.channel,
    });

    await this.baseClient.post<void>(
      `/bridges/${bridgeId}/removeChannel?${queryParams}`,
    );
  }

  /**
   * Plays media on a specified bridge.
   *
   * This asynchronous function initiates media playback on a bridge identified by its ID.
   * It allows for customization of the playback through various options in the request.
   *
   * @param bridgeId - The unique identifier of the bridge on which to play the media.
   * @param request - An object containing the media playback request details.
   * @param request.media - The media to be played (e.g., sound file, URL).
   * @param request.lang - Optional. The language of the media content.
   * @param request.offsetms - Optional. The offset in milliseconds to start playing from.
   * @param request.skipms - Optional. The number of milliseconds to skip before playing.
   * @param request.playbackId - Optional. A custom ID for the playback session.
   *
   * @returns A Promise that resolves to a BridgePlayback object, containing details about the initiated playback.
   *
   * @throws Will throw an error if the playback request fails or if there's a network issue.
   */
  async playMedia(
    bridgeId: string,
    request: PlayMediaRequest,
  ): Promise<BridgePlayback> {
    const queryParams = toQueryParams({
      ...(request.lang && { lang: request.lang }),
      ...(request.offsetms && { offsetms: request.offsetms.toString() }),
      ...(request.skipms && { skipms: request.skipms.toString() }),
      ...(request.playbackId && { playbackId: request.playbackId }),
    });

    return this.baseClient.post<BridgePlayback>(
      `/bridges/${bridgeId}/play?${queryParams}`,
      { media: request.media },
    );
  }

  /**
   * Stops media playback on a specified bridge.
   *
   * This asynchronous function sends a DELETE request to stop the playback of media
   * on a bridge identified by its ID and a specific playback session.
   *
   * @param bridgeId - The unique identifier of the bridge where the playback is to be stopped.
   * @param playbackId - The unique identifier of the playback session to be stopped.
   *
   * @returns A Promise that resolves to void when the playback is successfully stopped.
   *
   * @throws Will throw an error if the request fails, such as if the bridge or playback session
   *         doesn't exist, or if there's a network issue.
   */
  async stopPlayback(bridgeId: string, playbackId: string): Promise<void> {
    await this.baseClient.delete<void>(
      `/bridges/${bridgeId}/play/${playbackId}`,
    );
  }

  /**
   * Sets the video source for a specified bridge.
   *
   * This asynchronous function configures a channel as the video source for a given bridge.
   * It sends a POST request to the ARI endpoint to update the bridge's video source.
   *
   * @param bridgeId - The unique identifier of the bridge for which to set the video source.
   * @param channelId - The unique identifier of the channel to be set as the video source.
   *
   * @returns A Promise that resolves to void when the video source is successfully set.
   *
   * @throws Will throw an error if the request fails, such as if the bridge or channel
   *         doesn't exist, or if there's a network issue.
   */
  async setVideoSource(bridgeId: string, channelId: string): Promise<void> {
    const queryParams = toQueryParams({ channelId });
    await this.baseClient.post<void>(
      `/bridges/${bridgeId}/videoSource?${queryParams}`,
    );
  }

  /**
   * Clears the video source for a specified bridge.
   *
   * This asynchronous function removes the currently set video source from a bridge.
   * It sends a DELETE request to the ARI endpoint to clear the video source configuration.
   *
   * @param bridgeId - The unique identifier of the bridge from which to clear the video source.
   *                   This should be a string that uniquely identifies the bridge in the system.
   *
   * @returns A Promise that resolves to void when the video source is successfully cleared.
   *          If the operation is successful, the bridge will no longer have a designated video source.
   *
   * @throws Will throw an error if the request fails, such as if the bridge doesn't exist,
   *         if there's no video source set, or if there's a network issue.
   */
  async clearVideoSource(bridgeId: string): Promise<void> {
    await this.baseClient.delete<void>(`/bridges/${bridgeId}/videoSource`);
  }

  /**
   * Retrieves the count of active bridge instances.
   *
   * This function returns the total number of bridge instances currently
   * managed by the Bridges class. It provides a quick way to check how many
   * active bridges are present in the system.
   *
   * @returns {number} The count of active bridge instances.
   */
  getInstanceCount(): number {
    return this.bridgeInstances.size;
  }

  /**
   * Checks if a bridge instance exists in the collection of managed bridges.
   *
   * This function verifies whether a bridge instance with the specified ID
   * is currently being managed by the Bridges class.
   *
   * @param bridgeId - The unique identifier of the bridge instance to check.
   *                   This should be a string that uniquely identifies the bridge in the system.
   *
   * @returns A boolean value indicating whether the bridge instance exists.
   *          Returns true if the bridge instance is found, false otherwise.
   */
  hasInstance(bridgeId: string): boolean {
    return this.bridgeInstances.has(bridgeId);
  }

  /**
   * Retrieves all active bridge instances currently managed by the Bridges class.
   *
   * This method provides a way to access all the BridgeInstance objects that are
   * currently active and being managed. It returns a new Map to prevent direct
   * modification of the internal bridgeInstances collection.
   *
   * @returns A new Map object containing all active bridge instances, where the keys
   *          are the bridge IDs (strings) and the values are the corresponding
   *          BridgeInstance objects. If no bridges are active, an empty Map is returned.
   */
  getAllInstances(): Map<string, BridgeInstance> {
    return new Map(this.bridgeInstances);
  }
}
