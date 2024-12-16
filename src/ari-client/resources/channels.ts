import { EventEmitter } from "events";
import { isAxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import type { AriClient } from "../ariClient";
import type { BaseClient } from "../baseClient.js";
import type {
  Channel,
  ChannelPlayback,
  ChannelVar,
  ExternalMediaOptions,
  OriginateRequest,
  PlaybackOptions,
  RTPStats,
  RecordingOptions,
  SnoopOptions,
  WebSocketEvent,
} from "../interfaces";
import { toQueryParams } from "../utils";
import type { PlaybackInstance } from "./playbacks";

/**
 * Utility function to extract error message
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
 * Represents an instance of a communication channel managed by the AriClient.
 */
export class ChannelInstance {
  private readonly eventEmitter = new EventEmitter();
  private channelData: Channel | null = null;
  public readonly id: string;

  constructor(
    private readonly client: AriClient,
    private readonly baseClient: BaseClient,
    channelId?: string,
  ) {
    this.id = channelId || `channel-${Date.now()}`;
    console.log(`Channel instance initialized with ID: ${this.id}`);
  }

  /**
   * Registers an event listener for specific channel events
   */
  on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.on(event, wrappedListener);
    console.log(`Event listener registered for ${event} on channel ${this.id}`);
  }

  /**
   * Registers a one-time event listener
   */
  once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!event) {
      throw new Error("Event type is required");
    }

    const wrappedListener = (data: WebSocketEvent) => {
      if ("channel" in data && data.channel?.id === this.id) {
        listener(data as Extract<WebSocketEvent, { type: T }>);
      }
    };
    this.eventEmitter.once(event, wrappedListener);
    console.log(
      `One-time event listener registered for ${event} on channel ${this.id}`,
    );
  }

  /**
   * Removes event listener(s) for a specific WebSocket event type.
   * If a specific listener is provided, only that listener is removed.
   * Otherwise, all listeners for the given event type are removed.
   *
   * @param {T} event - The type of WebSocket event to remove listener(s) for
   * @param {Function} [listener] - Optional specific listener to remove
   * @throws {Error} If no event type is provided
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
        `Specific listener removed for ${event} on channel ${this.id}`,
      );
    } else {
      this.eventEmitter.removeAllListeners(event);
      console.log(`All listeners removed for ${event} on channel ${this.id}`);
    }
  }

  /**
   * Emits an event if it matches the current channel
   */
  emitEvent(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Received invalid event");
      return;
    }

    if ("channel" in event && event.channel?.id === this.id) {
      this.eventEmitter.emit(event.type, event);
      console.log(`Event ${event.type} emitted for channel ${this.id}`);
    }
  }

  /**
   * Removes all event listeners associated with the current instance.
   * This ensures that there are no lingering event handlers for the channel.
   *
   * @return {void} This method does not return a value.
   */
  removeAllListeners(): void {
    console.log(`Removendo todos os listeners para o canal ${this.id}`);
    this.eventEmitter.removeAllListeners();
  }

  /**
   * Answers the channel
   */
  async answer(): Promise<void> {
    try {
      await this.baseClient.post<void>(`/channels/${this.id}/answer`);
      console.log(`Channel ${this.id} answered`);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error answering channel ${this.id}:`, message);
      throw new Error(`Failed to answer channel: ${message}`);
    }
  }

  /**
   * Originates a new channel
   *
   * @param data - Channel origination configuration
   * @returns Promise resolving to the created channel
   * @throws Error if channel already exists or origination fails
   */
  async originate(data: OriginateRequest): Promise<Channel> {
    if (this.channelData) {
      throw new Error("Channel has already been created");
    }

    try {
      this.channelData = await this.baseClient.post<Channel, OriginateRequest>(
        "/channels",
        data,
      );
      console.log(
        `Channel originated successfully with ID: ${this.channelData.id}`,
      );
      return this.channelData;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error originating channel:`, message);
      throw new Error(`Failed to originate channel: ${message}`);
    }
  }

  /**
   * Plays media on the channel
   */
  async play(
    options: { media: string; lang?: string },
    playbackId?: string,
  ): Promise<PlaybackInstance> {
    if (!options.media) {
      throw new Error("Media URL is required");
    }

    try {
      if (!this.channelData) {
        console.log("Initializing channel details...");
        this.channelData = await this.getDetails();
      }

      const playback = this.client.Playback(playbackId || uuidv4());
      await this.baseClient.post<void>(
        `/channels/${this.id}/play/${playback.id}`,
        options,
      );

      console.log(`Media playback started on channel ${this.id}`);
      return playback;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error playing media on channel ${this.id}:`, message);
      throw new Error(`Failed to play media: ${message}`);
    }
  }

  /**
   * Gets the current channel details
   */
  async getDetails(): Promise<Channel> {
    try {
      if (this.channelData) {
        return this.channelData;
      }

      if (!this.id) {
        throw new Error("No channel ID associated with this instance");
      }

      const details = await this.baseClient.get<Channel>(
        `/channels/${this.id}`,
      );
      this.channelData = details;
      console.log(`Retrieved channel details for ${this.id}`);
      return details;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(
        `Error retrieving channel details for ${this.id}:`,
        message,
      );
      throw new Error(`Failed to get channel details: ${message}`);
    }
  }

  /**
   * Checks if the channel has any listeners for a specific event
   */
  hasListeners(event: string): boolean {
    return this.eventEmitter.listenerCount(event) > 0;
  }

  /**
   * Gets the count of listeners for a specific event
   */
  getListenerCount(event: string): number {
    return this.eventEmitter.listenerCount(event);
  }

  /**
   * Fetches a specific channel variable.
   *
   * @param {string} variable - The name of the variable to retrieve. This parameter is required.
   * @return {Promise<ChannelVar>} A promise that resolves with the value of the requested channel variable.
   * @throws {Error} If the 'variable' parameter is not provided.
   */
  async getVariable(variable: string): Promise<ChannelVar> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get<ChannelVar>(
      `/channels/${this.id}/variable?variable=${encodeURIComponent(variable)}`,
    );
  }

  /**
   * Terminates the active call associated with the current channel.
   * This method ensures that channel details are initialized before attempting to hang up.
   * If the channel ID is invalid or cannot be determined, an error is thrown.
   *
   * @return {Promise<void>} A promise that resolves when the call is successfully terminated.
   */
  async hangup(): Promise<void> {
    if (!this.channelData) {
      console.log("Canal não inicializado, buscando detalhes...");
      this.channelData = await this.getDetails();
    }

    if (!this.channelData?.id) {
      throw new Error("Não foi possível inicializar o canal. ID inválido.");
    }

    await this.baseClient.delete(`/channels/${this.channelData.id}`);
  }

  /**
   * Plays media on the specified channel using the provided media URL and optional playback options.
   *
   * @param {string} media - The URL or identifier of the media to be played.
   * @param {PlaybackOptions} [options] - Optional playback settings such as volume, playback speed, etc.
   * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
   * @throws {Error} Throws an error if the channel has not been created.
   */
  async playMedia(
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    if (!this.channelData) {
      throw new Error("O canal ainda não foi criado.");
    }

    const queryParams = options
      ? `?${new URLSearchParams(options as Record<string, string>).toString()}`
      : "";

    return this.baseClient.post<ChannelPlayback>(
      `/channels/${this.channelData.id}/play${queryParams}`,
      { media },
    );
  }

  /**
   * Stops the playback for the given playback ID.
   *
   * @param {string} playbackId - The unique identifier for the playback to be stopped.
   * @return {Promise<void>} A promise that resolves when the playback is successfully stopped.
   * @throws {Error} Throws an error if the instance is not associated with a channel.
   */
  async stopPlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/play/${playbackId}`,
    );
  }

  /**
   * Pauses the playback of the specified media on a channel.
   *
   * @param {string} playbackId - The unique identifier of the playback to be paused.
   * @return {Promise<void>} A promise that resolves when the playback has been successfully paused.
   * @throws {Error} Throws an error if the channel is not associated with the current instance.
   */
  async pausePlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`,
    );
  }

  /**
   * Resumes playback of the specified playback session on the associated channel.
   *
   * @param {string} playbackId - The unique identifier of the playback session to be resumed.
   * @return {Promise<void>} A promise that resolves when the playback has been successfully resumed.
   * @throws {Error} Throws an error if the channel is not associated with this instance.
   */
  async resumePlayback(playbackId: string): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/pause`,
    );
  }

  /**
   * Rewinds the playback of a media by a specified amount of milliseconds.
   *
   * @param {string} playbackId - The unique identifier for the playback session to be rewound.
   * @param {number} skipMs - The number of milliseconds to rewind the playback.
   * @return {Promise<void>} A promise that resolves when the rewind operation is complete.
   */
  async rewindPlayback(playbackId: string, skipMs: number): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/rewind`,
      { skipMs },
    );
  }

  /**
   * Fast forwards the playback by a specific duration in milliseconds.
   *
   * @param {string} playbackId - The unique identifier of the playback to be fast-forwarded.
   * @param {number} skipMs - The number of milliseconds to fast forward the playback.
   * @return {Promise<void>} A Promise that resolves when the fast-forward operation is complete.
   * @throws {Error} If no channel is associated with this instance.
   */
  async fastForwardPlayback(playbackId: string, skipMs: number): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/play/${playbackId}/forward`,
      { skipMs },
    );
  }

  /**
   * Mutes the specified channel for the given direction.
   *
   * @param {("both" | "in" | "out")} [direction="both"] - The direction to mute the channel. It can be "both" to mute incoming and outgoing, "in" to mute incoming, or "out" to mute outgoing.
   * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
   * @throws {Error} If the channel is not associated with this instance.
   */
  async muteChannel(direction: "both" | "in" | "out" = "both"): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(
      `/channels/${this.channelData.id}/mute?direction=${direction}`,
    );
  }

  /**
   * Unmutes a previously muted channel in the specified direction.
   *
   * @param {"both" | "in" | "out"} direction - The direction in which to unmute the channel.
   *        Defaults to "both", which unmutes both incoming and outgoing communication.
   * @return {Promise<void>} A promise that resolves once the channel has been successfully unmuted.
   * @throws {Error} If the channel is not associated with the current instance.
   */
  async unmuteChannel(
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(
      `/channels/${this.channelData.id}/mute?direction=${direction}`,
    );
  }

  /**
   * Places the associated channel on hold if the channel is valid and linked to this instance.
   *
   * @return {Promise<void>} A promise that resolves when the hold action is successfully executed.
   * @throws {Error} Throws an error if the channel is not associated with this instance.
   */
  async holdChannel(): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.post<void>(`/channels/${this.channelData.id}/hold`);
  }

  /**
   * Removes the hold status from a specific channel associated with this instance.
   * The method sends a delete request to the server to release the hold on the channel.
   * If no channel is associated with this instance, an error will be thrown.
   *
   * @return {Promise<void>} A promise that resolves when the channel hold has been successfully removed.
   * @throws {Error} If no channel is associated with this instance.
   */
  async unholdChannel(): Promise<void> {
    if (!this.channelData?.id) {
      throw new Error("Canal não associado a esta instância.");
    }

    await this.baseClient.delete<void>(`/channels/${this.channelData.id}/hold`);
  }
}

/**
 * The `Channels` class provides a comprehensive interface for managing
 * and interacting with communication channels.
 */
export class Channels {
  private readonly channelInstances = new Map<string, ChannelInstance>();

  constructor(
    private readonly baseClient: BaseClient,
    private readonly client: AriClient,
  ) {}

  /**
   * Creates or retrieves a ChannelInstance.
   *
   * @param {Object} [params] - Optional parameters for getting/creating a channel instance
   * @param {string} [params.id] - Optional ID of an existing channel
   * @returns {ChannelInstance} The requested or new channel instance
   * @throws {Error} If channel creation/retrieval fails
   *
   * @example
   * // Create new channel without ID
   * const channel1 = client.channels.Channel();
   *
   * // Create/retrieve channel with specific ID
   * const channel2 = client.channels.Channel({ id: 'some-id' });
   */
  Channel(params?: { id?: string }): ChannelInstance {
    try {
      const id = params?.id;

      if (!id) {
        const instance = new ChannelInstance(this.client, this.baseClient);
        this.channelInstances.set(instance.id, instance);
        console.log(`New channel instance created with ID: ${instance.id}`);
        return instance;
      }

      if (!this.channelInstances.has(id)) {
        const instance = new ChannelInstance(this.client, this.baseClient, id);
        this.channelInstances.set(id, instance);
        console.log(`New channel instance created with provided ID: ${id}`);
        return instance;
      }

      console.log(`Returning existing channel instance: ${id}`);
      return this.channelInstances.get(id)!;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error creating/retrieving channel instance:`, message);
      throw new Error(`Failed to manage channel instance: ${message}`);
    }
  }

  /**
   * Retrieves the details of a specific channel.
   *
   * @param {string} id - The unique identifier of the channel to retrieve.
   * @returns {Promise<Channel>} A promise that resolves to the Channel object containing the channel details.
   * @throws {Error} If no channel ID is associated with this instance or if there's an error retrieving the channel details.
   */
  async get(id: string): Promise<Channel> {
    try {
      if (id) {
        throw new Error("No channel ID associated with this instance");
      }
  
      const details = await this.baseClient.get<Channel>(`/channels/${id}`);
      console.log(`Retrieved channel details for ${id}`);
      return details;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error retrieving channel details for ${id}:`, message);
      throw new Error(`Failed to get channel details: ${message}`);
    }
  }

  /**
   * Removes a channel instance from the collection.
   */
  removeChannelInstance(channelId: string): void {
    if (!channelId) {
      throw new Error("Channel ID is required");
    }

    if (this.channelInstances.has(channelId)) {
      const instance = this.channelInstances.get(channelId);
      instance?.removeAllListeners();
      this.channelInstances.delete(channelId);
      console.log(`Channel instance removed: ${channelId}`);
    } else {
      console.warn(`Attempt to remove non-existent instance: ${channelId}`);
    }
  }

  /**
   * Propagates a WebSocket event to a specific channel.
   */
  propagateEventToChannel(event: WebSocketEvent): void {
    if (!event) {
      console.warn("Invalid WebSocket event received");
      return;
    }

    if ("channel" in event && event.channel?.id) {
      const instance = this.channelInstances.get(event.channel.id);
      if (instance) {
        instance.emitEvent(event);
        console.log(
          `Event propagated to channel ${event.channel.id}: ${event.type}`,
        );
      } else {
        console.warn(`No instance found for channel ${event.channel.id}`);
      }
    }
  }

  /**
   * Initiates a new channel.
   */
  async originate(data: OriginateRequest): Promise<Channel> {
    if (!data.endpoint) {
      throw new Error("Endpoint is required for channel origination");
    }

    try {
      const channel = await this.baseClient.post<Channel>("/channels", data);
      console.log(`Channel originated successfully with ID: ${channel.id}`);
      return channel;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error originating channel:`, message);
      throw new Error(`Failed to originate channel: ${message}`);
    }
  }

  /**
   * Lists all active channels.
   */
  async list(): Promise<Channel[]> {
    try {
      const channels = await this.baseClient.get<unknown>("/channels");
      if (!Array.isArray(channels)) {
        throw new Error("API response for /channels is not an array");
      }
      console.log(`Retrieved ${channels.length} active channels`);
      return channels as Channel[];
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`Error listing channels:`, message);
      throw new Error(`Failed to list channels: ${message}`);
    }
  }

  /**
   * Gets the count of active channel instances.
   */
  getInstanceCount(): number {
    return this.channelInstances.size;
  }

  /**
   * Checks if a channel instance exists.
   */
  hasInstance(channelId: string): boolean {
    return this.channelInstances.has(channelId);
  }

  /**
   * Gets all active channel instances.
   */
  getAllInstances(): Map<string, ChannelInstance> {
    return new Map(this.channelInstances);
  }

  /**
   * Terminates an active call on the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel to hang up.
   * @param {Object} [options] - Optional parameters for the hangup request.
   * @param {string} [options.reason_code] - A code indicating the reason for the hangup.
   * @param {string} [options.reason] - A descriptive reason for the hangup.
   * @return {Promise<void>} A promise that resolves when the call has been successfully terminated.
   */
  async hangup(
    channelId: string,
    options?: { reason_code?: string; reason?: string },
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(options?.reason_code && { reason_code: options.reason_code }),
      ...(options?.reason && { reason: options.reason }),
    });

    return this.baseClient.delete<void>(
      `/channels/${channelId}?${queryParams.toString()}`,
    );
  }

  /**
   * Initiates snooping on a specified channel with the provided options.
   *
   * @param {string} channelId - The unique identifier of the channel to snoop on.
   * @param {SnoopOptions} options - Configuration options for the snooping operation.
   * @return {Promise<Channel>} A promise that resolves to the snooped channel data.
   */
  async snoopChannel(
    channelId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/snoop?${queryParams}`,
    );
  }

  /**
   * Starts a silence mode for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where silence mode should be started.
   * @return {Promise<void>} A promise that resolves when the silence mode is successfully started.
   */
  async startSilence(channelId: string): Promise<void> {
    return this.baseClient.post<void>(`/channels/${channelId}/silence`);
  }

  /**
   * Stops the silence mode for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel for which silence mode should be stopped.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async stopSilence(channelId: string): Promise<void> {
    return this.baseClient.delete<void>(`/channels/${channelId}/silence`);
  }

  /**
   * Retrieves the Real-Time Protocol (RTP) statistics for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel for which RTP statistics are fetched.
   * @return {Promise<RTPStats>} A promise that resolves to the RTP statistics for the specified channel.
   */
  async getRTPStatistics(channelId: string): Promise<RTPStats> {
    return this.baseClient.get<RTPStats>(
      `/channels/${channelId}/rtp_statistics`,
    );
  }

  /**
   * Creates an external media channel with the given options.
   *
   * @param {ExternalMediaOptions} options - The configuration options for creating the external media channel.
   * @return {Promise<Channel>} A promise that resolves with the created external media channel.
   */
  async createExternalMedia(options: ExternalMediaOptions): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/externalMedia?${queryParams}`,
    );
  }

  /**
   * Initiates playback of a specific media item on a channel using the provided playback ID.
   *
   * @param {string} channelId - The unique identifier of the channel where playback will occur.
   * @param {string} playbackId - The unique identifier for the specific playback session.
   * @param {string} media - The media content to be played.
   * @param {PlaybackOptions} [options] - Optional playback configuration parameters.
   * @return {Promise<ChannelPlayback>} A promise that resolves with the playback details for the channel.
   */
  async playWithId(
    channelId: string,
    playbackId: string,
    media: string,
    options?: PlaybackOptions,
  ): Promise<ChannelPlayback> {
    const queryParams = options ? `?${toQueryParams(options)}` : "";
    return this.baseClient.post<ChannelPlayback>(
      `/channels/${channelId}/play/${playbackId}${queryParams}`,
      { media },
    );
  }

  /**
   * Initiates a snoop operation on a specific channel using the provided channel ID and snoop ID.
   *
   * @param {string} channelId - The unique identifier of the channel to snoop on.
   * @param {string} snoopId - The unique identifier for the snoop operation.
   * @param {SnoopOptions} options - Additional options and parameters for the snoop operation.
   * @return {Promise<Channel>} A promise that resolves to the channel details after the snoop operation is initiated.
   */
  async snoopChannelWithId(
    channelId: string,
    snoopId: string,
    options: SnoopOptions,
  ): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/snoop/${snoopId}?${queryParams}`,
    );
  }

  /**
   * Starts Music on Hold for the specified channel with the provided Music on Hold class.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} mohClass - The Music on Hold class to be applied.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async startMohWithClass(channelId: string, mohClass: string): Promise<void> {
    const queryParams = `mohClass=${encodeURIComponent(mohClass)}`;
    await this.baseClient.post<void>(
      `/channels/${channelId}/moh?${queryParams}`,
    );
  }

  /**
   * Retrieves the value of a specified variable for a given channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} variable - The name of the variable to retrieve.
   * @return {Promise<ChannelVar>} A promise that resolves to the value of the channel variable.
   * @throws {Error} Throws an error if the 'variable' parameter is not provided.
   */
  async getChannelVariable(
    channelId: string,
    variable: string,
  ): Promise<ChannelVar> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    return this.baseClient.get<ChannelVar>(
      `/channels/${channelId}/variable?variable=${encodeURIComponent(variable)}`,
    );
  }

  /**
   * Sets a variable for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} variable - The name of the variable to be set. This parameter is required.
   * @param {string} [value] - The value of the variable to be set. This parameter is optional.
   * @return {Promise<void>} A promise that resolves when the variable is successfully set.
   * @throws {Error} Throws an error if the `variable` parameter is not provided.
   */
  async setChannelVariable(
    channelId: string,
    variable: string,
    value?: string,
  ): Promise<void> {
    if (!variable) {
      throw new Error("The 'variable' parameter is required.");
    }
    const queryParams = new URLSearchParams({
      variable,
      ...(value && { value }),
    });
    await this.baseClient.post<void>(
      `/channels/${channelId}/variable?${queryParams}`,
    );
  }

  /**
   * Moves a specified channel to the given application with optional arguments.
   *
   * @param {string} channelId - The unique identifier of the channel to be moved.
   * @param {string} app - The target application to which the channel will be moved.
   * @param {string} [appArgs] - Optional arguments to be passed to the target application.
   * @return {Promise<void>} A promise that resolves when the operation is completed.
   */
  async moveToApplication(
    channelId: string,
    app: string,
    appArgs?: string,
  ): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/move`, {
      app,
      appArgs,
    });
  }

  /**
   * Continues the execution of a dialplan for a specific channel.
   *
   * @param {string} channelId - The unique identifier of the channel.
   * @param {string} [context] - The dialplan context to continue execution in, if specified.
   * @param {string} [extension] - The dialplan extension to proceed with, if provided.
   * @param {number} [priority] - The priority within the dialplan extension to resume at, if specified.
   * @param {string} [label] - The label to start from within the dialplan, if given.
   * @return {Promise<void>} Resolves when the dialplan is successfully continued.
   */
  async continueDialplan(
    channelId: string,
    context?: string,
    extension?: string,
    priority?: number,
    label?: string,
  ): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/continue`, {
      context,
      extension,
      priority,
      label,
    });
  }

  /**
   * Stops the music on hold for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where music on hold should be stopped.
   * @return {Promise<void>} Resolves when the music on hold is successfully stopped.
   */
  async stopMusicOnHold(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/moh`);
  }

  /**
   * Initiates the music on hold for the specified channel.
   *
   * @param {string} channelId - The unique identifier of the channel where the music on hold will be started.
   * @return {Promise<void>} A promise that resolves when the operation has been successfully invoked.
   */
  async startMusicOnHold(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/moh`);
  }

  /**
   * Starts recording for a specific channel based on the provided options.
   *
   * @param {string} channelId - The unique identifier of the channel to start recording.
   * @param {RecordingOptions} options - The recording options to configure the recording process.
   * @return {Promise<Channel>} A promise that resolves to the channel object with updated recording state.
   */
  async record(channelId: string, options: RecordingOptions): Promise<Channel> {
    const queryParams = toQueryParams(options);
    return this.baseClient.post<Channel>(
      `/channels/${channelId}/record?${queryParams}`,
    );
  }

  /**
   * Initiates a call on the specified channel with optional parameters for caller identification and timeout duration.
   *
   * @param {string} channelId - The ID of the channel where the call will be initiated.
   * @param {string} [caller] - Optional parameter specifying the name or identifier of the caller.
   * @param {number} [timeout] - Optional parameter defining the timeout duration for the call in seconds.
   * @return {Promise<void>} A promise that resolves when the call has been successfully initiated.
   */
  async dial(
    channelId: string,
    caller?: string,
    timeout?: number,
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      ...(caller && { caller }),
      ...(timeout && { timeout: timeout.toString() }),
    });
    await this.baseClient.post<void>(
      `/channels/${channelId}/dial?${queryParams}`,
    );
  }

  /**
   * Redirects a channel to the specified endpoint.
   *
   * This method sends a POST request to update the redirect endpoint for the given channel.
   *
   * @param {string} channelId - The unique identifier of the channel to be redirected.
   * @param {string} endpoint - The new endpoint to redirect the channel to.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async redirectChannel(channelId: string, endpoint: string): Promise<void> {
    await this.baseClient.post<void>(
      `/channels/${channelId}/redirect?endpoint=${encodeURIComponent(endpoint)}`,
    );
  }

  /**
   * Answers a specified channel by sending a POST request to the corresponding endpoint.
   *
   * @param {string} channelId - The unique identifier of the channel to be answered.
   * @return {Promise<void>} A promise that resolves when the channel has been successfully answered.
   */
  async answerChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/answer`);
  }

  /**
   * Rings the specified channel by sending a POST request to the appropriate endpoint.
   *
   * @param {string} channelId - The unique identifier of the channel to be rung.
   * @return {Promise<void>} A promise that resolves when the operation completes successfully.
   */
  async ringChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/ring`);
  }

  /**
   * Stops the ring channel for the specified channel ID.
   *
   * This method sends a DELETE request to the server to stop the ring action
   * associated with the provided channel ID.
   *
   * @param {string} channelId - The unique identifier of the channel for which the ring action should be stopped.
   * @return {Promise<void>} A promise that resolves when the ring channel is successfully stopped.
   */
  async stopRingChannel(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/ring`);
  }

  /**
   * Sends DTMF (Dual-Tone Multi-Frequency) signals to a specified channel.
   *
   * @param {string} channelId - The ID of the channel to which the DTMF signals should be sent.
   * @param {string} dtmf - The DTMF tones to be sent, represented as a string. Each character corresponds to a specific tone.
   * @param {Object} [options] - Optional configuration for the DTMF signal timing.
   * @param {number} [options.before] - Time in milliseconds to wait before sending the first DTMF tone.
   * @param {number} [options.between] - Time in milliseconds to wait between sending successive DTMF tones.
   * @param {number} [options.duration] - Duration in milliseconds for each DTMF tone.
   * @param {number} [options.after] - Time in milliseconds to wait after sending the last DTMF tone.
   * @return {Promise<void>} A promise that resolves when the DTMF signals are successfully sent.
   */
  async sendDTMF(
    channelId: string,
    dtmf: string,
    options?: {
      before?: number;
      between?: number;
      duration?: number;
      after?: number;
    },
  ): Promise<void> {
    const queryParams = toQueryParams({ dtmf, ...options });
    await this.baseClient.post<void>(
      `/channels/${channelId}/dtmf?${queryParams}`,
    );
  }

  /**
   * Mutes a specified channel in the given direction.
   *
   * @param {string} channelId - The unique identifier of the channel to be muted.
   * @param {"both" | "in" | "out"} [direction="both"] - The direction for muting, can be "both", "in", or "out". Default is "both".
   * @return {Promise<void>} A promise that resolves when the channel is successfully muted.
   */
  async muteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    await this.baseClient.post<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  /**
   * Unmutes a previously muted channel, allowing communication in the specified direction(s).
   *
   * @param {string} channelId - The unique identifier of the channel to be unmuted.
   * @param {"both" | "in" | "out"} [direction="both"] - The direction of communication to unmute. Valid options are "both", "in" (incoming messages), or "out" (outgoing messages). Defaults to "both".
   * @return {Promise<void>} A promise that resolves when the channel is successfully unmuted.
   */
  async unmuteChannel(
    channelId: string,
    direction: "both" | "in" | "out" = "both",
  ): Promise<void> {
    await this.baseClient.delete<void>(
      `/channels/${channelId}/mute?direction=${direction}`,
    );
  }

  /**
   * Places a specific channel on hold by sending a POST request to the server.
   *
   * @param {string} channelId - The unique identifier of the channel to be placed on hold.
   * @return {Promise<void>} A promise that resolves when the channel hold operation is completed.
   */
  async holdChannel(channelId: string): Promise<void> {
    await this.baseClient.post<void>(`/channels/${channelId}/hold`);
  }

  /**
   * Removes the hold status from a specific channel by its ID.
   *
   * @param {string} channelId - The unique identifier of the channel to unhold.
   * @return {Promise<void>} A promise that resolves when the channel hold is successfully removed.
   */
  async unholdChannel(channelId: string): Promise<void> {
    await this.baseClient.delete<void>(`/channels/${channelId}/hold`);
  }

  /**
   * Creates a new communication channel with the specified configuration.
   *
   * @param {OriginateRequest} data - The configuration data required to create the channel, including relevant details such as endpoint and channel variables.
   * @return {Promise<Channel>} A promise that resolves with the details of the created channel.
   */
  async createChannel(data: OriginateRequest): Promise<Channel> {
    return this.baseClient.post<Channel>("/channels/create", data);
  }

  /**
   * Initiates a new channel with the specified channel ID and originates a call using the provided data.
   *
   * @param {string} channelId - The unique identifier of the channel to be created.
   * @param {OriginateRequest} data - The data required to originate the call, including details such as endpoint and caller information.
   * @return {Promise<Channel>} A promise that resolves to the created Channel object.
   */
  async originateWithId(
    channelId: string,
    data: OriginateRequest,
  ): Promise<Channel> {
    return this.baseClient.post<Channel>(`/channels/${channelId}`, data);
  }
}
