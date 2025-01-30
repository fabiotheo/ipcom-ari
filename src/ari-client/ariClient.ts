import { BaseClient } from "./baseClient.js";
import type {
  AriClientConfig,
  WebSocketEvent,
  WebSocketEventType,
} from "./interfaces";
import { Applications } from "./resources/applications.js";
import { Asterisk } from "./resources/asterisk";
import { type BridgeInstance, Bridges } from "./resources/bridges";
import { type ChannelInstance, Channels } from "./resources/channels.js";
import { Endpoints } from "./resources/endpoints";
import { type PlaybackInstance, Playbacks } from "./resources/playbacks";
import { Sounds } from "./resources/sounds";
import { WebSocketClient } from "./websocketClient.js";

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
export class AriClient {
  private readonly baseClient: BaseClient;
  private webSocketClient?: WebSocketClient;

  public readonly channels: Channels;
  public readonly endpoints: Endpoints;
  public readonly applications: Applications;
  public readonly playbacks: Playbacks;
  public readonly sounds: Sounds;
  public readonly asterisk: Asterisk;
  public readonly bridges: Bridges;

  /**
   * Creates a new instance of the ARI client.
   *
   * @param {AriClientConfig} config - Configuration options for the ARI client
   * @throws {Error} If required configuration parameters are missing
   */
  constructor(private readonly config: AriClientConfig) {
    if (!config.host || !config.port || !config.username || !config.password) {
      throw new Error("Missing required configuration parameters");
    }

    // Normalize host and create base URL
    const httpProtocol = config.secure ? "https" : "http";
    const normalizedHost = config.host.replace(/^https?:\/\//, "");
    const baseUrl = `${httpProtocol}://${normalizedHost}:${config.port}/ari`;

    // Initialize base client and resources
    this.baseClient = new BaseClient(baseUrl, config.username, config.password);

    // Initialize resource handlers
    this.channels = new Channels(this.baseClient, this);
    this.playbacks = new Playbacks(this.baseClient, this);
    this.bridges = new Bridges(this.baseClient, this);
    this.endpoints = new Endpoints(this.baseClient);
    this.applications = new Applications(this.baseClient);
    this.sounds = new Sounds(this.baseClient);
    this.asterisk = new Asterisk(this.baseClient);

    console.log(`ARI Client initialized with base URL: ${baseUrl}`);
  }

  /**
   * Initializes a WebSocket connection for receiving events.
   *
   * @param {string[]} apps - List of application names to subscribe to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of specific event types to subscribe to
   * @returns {Promise<void>} Resolves when connection is established
   * @throws {Error} If connection fails or if WebSocket is already connected
   */
  public async connectWebSocket(
    apps: string[],
    subscribedEvents?: WebSocketEventType[],
  ): Promise<void> {
    if (!apps.length) {
      throw new Error("At least one application name is required");
    }

    if (this.webSocketClient) {
      console.warn("WebSocket is already connected");
      return;
    }

    try {
      this.webSocketClient = new WebSocketClient(
        this.baseClient,
        apps,
        subscribedEvents,
        this,
      );
      await this.webSocketClient.connect();
      console.log("WebSocket connection established successfully");
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      this.webSocketClient = undefined;
      throw error;
    }
  }

  /**
   * Registers an event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  public on<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!this.webSocketClient) {
      throw new Error("WebSocket is not connected");
    }
    this.webSocketClient.on(event, listener);
    console.log(`Event listener registered for ${event}`);
  }

  /**
   * Registers a one-time event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  public once<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!this.webSocketClient) {
      throw new Error("WebSocket is not connected");
    }
    this.webSocketClient.once(event, listener);
    console.log(`One-time event listener registered for ${event}`);
  }

  /**
   * Removes an event listener for WebSocket events.
   *
   * @param {T} event - The event type to remove listener for
   * @param {Function} listener - The listener function to remove
   */
  public off<T extends WebSocketEvent["type"]>(
    event: T,
    listener: (data: Extract<WebSocketEvent, { type: T }>) => void,
  ): void {
    if (!this.webSocketClient) {
      console.warn("No WebSocket connection to remove listener from");
      return;
    }
    this.webSocketClient.off(event, listener);
    console.log(`Event listener removed for ${event}`);
  }

  /**
   * Closes the WebSocket connection if one exists.
   */
  public closeWebSocket(): void {
    if (!this.webSocketClient) {
      console.warn("No WebSocket connection to close");
      return;
    }
    this.webSocketClient.close();
    this.webSocketClient = undefined;
    console.log("WebSocket connection closed");
  }

  /**
   * Creates or retrieves a Channel instance.
   *
   * @param {string} [channelId] - Optional ID of an existing channel
   * @returns {ChannelInstance} A new or existing channel instance
   */
  public Channel(channelId?: string): ChannelInstance {
    return this.channels.Channel({ id: channelId });
  }

  /**
   * Creates or retrieves a Playback instance.
   *
   * @param {string} [playbackId] - Optional ID of an existing playback
   * @param {string} [_app] - Optional application name (deprecated)
   * @returns {PlaybackInstance} A new or existing playback instance
   */
  public Playback(playbackId?: string, _app?: string): PlaybackInstance {
    return this.playbacks.Playback({ id: playbackId });
  }

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
  public Bridge(bridgeId?: string): BridgeInstance {
    return this.bridges.Bridge({ id: bridgeId });
  }

  /**
   * Gets the current WebSocket connection status.
   *
   * @returns {boolean} True if WebSocket is connected, false otherwise
   */
  public isWebSocketConnected(): boolean {
    return !!this.webSocketClient;
  }
}
