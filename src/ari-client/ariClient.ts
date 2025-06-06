/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseClient } from './baseClient.js';
import type {
  AriClientConfig,
  WebSocketEvent,
  WebSocketEventType,
} from './interfaces';
import type {
  TypedWebSocketEventListener,
  WebSocketEventListener,
} from './interfaces/websocket.types';
import { Applications } from './resources/applications.js';
import { Asterisk } from './resources/asterisk';
import { type BridgeInstance, Bridges } from './resources/bridges';
import { type ChannelInstance, Channels } from './resources/channels.js';
import { Endpoints } from './resources/endpoints';
import { type PlaybackInstance, Playbacks } from './resources/playbacks';
import { Sounds } from './resources/sounds';
import { WebSocketClient } from './websocketClient.js';

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
  private eventListeners = new Map<string, WebSocketEventListener[]>();

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
      throw new Error('Missing required configuration parameters');
    }

    // Normalize host and create base URL
    const httpProtocol = config.secure ? 'https' : 'http';
    const normalizedHost = config.host.replace(/^https?:\/\//, '');
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

  public async cleanup(): Promise<void> {
    try {
      console.log('Starting ARI Client cleanup...');

      // Primeiro limpa o WebSocket para evitar novos eventos
      if (this.webSocketClient) {
        await this.closeWebSocket();
      }

      // Limpar todos os resources em paralelo
      await Promise.all([
        // Cleanup de channels
        (async () => {
          try {
            this.channels.cleanup();
          } catch (error) {
            console.error('Error cleaning up channels:', error);
          }
        })(),
        // Cleanup de playbacks
        (async () => {
          try {
            this.playbacks.cleanup();
          } catch (error) {
            console.error('Error cleaning up playbacks:', error);
          }
        })(),
        // Cleanup de bridges
        (async () => {
          try {
            this.bridges.cleanup();
          } catch (error) {
            console.error('Error cleaning up bridges:', error);
          }
        })(),
      ]);

      // Limpar listeners do cliente ARI
      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach((listener) => {
          this.off(event as WebSocketEvent['type'], listener);
        });
      });
      this.eventListeners.clear();

      console.log('ARI Client cleanup completed successfully');
    } catch (error) {
      console.error('Error during ARI Client cleanup:', error);
      throw error;
    }
  }

  /**
   * Initializes a WebSocket connection for receiving events.
   *
   * @param {string[]} apps - List of application names to subscribe to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of specific event types to subscribe to
   * @returns {Promise<void>} Resolves when connection is established
   * @throws {Error} If connection fails
   */
  public async connectWebSocket(
    apps: string[],
    subscribedEvents?: WebSocketEventType[]
  ): Promise<void> {
    try {
      if (!apps.length) {
        throw new Error('At least one application name is required.');
      }

      // Se já existe uma conexão, apenas adicione novas aplicações sem fechar
      if (this.webSocketClient && this.webSocketClient.isConnected()) {
        console.log(
          'WebSocket already connected. Reconnecting with updated apps...'
        );
        await this.webSocketClient.reconnectWithApps(apps, subscribedEvents);
        return;
      }

      // Criar nova conexão (apenas se não existir uma ativa)
      this.webSocketClient = new WebSocketClient(
        this.baseClient,
        apps,
        subscribedEvents,
        this
      );

      await this.webSocketClient.connect();
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      throw error;
    }
  }

  /**
   * Adds applications to the existing WebSocket connection.
   *
   * @param {string[]} apps - Additional applications to subscribe to
   * @param {WebSocketEventType[]} [subscribedEvents] - Optional list of specific event types to subscribe to
   * @returns {Promise<void>} Resolves when applications are added successfully
   * @throws {Error} If no WebSocket connection exists or if the operation fails
   */
  public async addApplicationsToWebSocket(
    apps: string[],
    subscribedEvents?: WebSocketEventType[]
  ): Promise<void> {
    if (!this.webSocketClient || !this.webSocketClient.isConnected()) {
      throw new Error(
        'No active WebSocket connection. Create one first with connectWebSocket().'
      );
    }

    await this.webSocketClient.addApps(apps, subscribedEvents);
  }

  /**
   * Destroys the ARI Client instance, cleaning up all resources and removing circular references.
   * This method should be called when the ARI Client is no longer needed to ensure proper cleanup.
   *
   * @returns {Promise<void>} A promise that resolves when the destruction process is complete.
   * @throws {Error} If an error occurs during the destruction process.
   */
  public async destroy(): Promise<void> {
    try {
      console.log('Destroying ARI Client...');

      // Cleanup de todos os recursos
      await this.cleanup();

      // Limpar referências
      this.webSocketClient = undefined;

      // Remover todas as referências circulares
      (this.channels as any) = null;
      (this.playbacks as any) = null;
      (this.bridges as any) = null;
      (this.endpoints as any) = null;
      (this.applications as any) = null;
      (this.sounds as any) = null;
      (this.asterisk as any) = null;

      console.log('ARI Client destroyed successfully');
    } catch (error) {
      console.error('Error destroying ARI Client:', error);
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
  /**
   * Registers an event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  public on<T extends WebSocketEvent['type']>(
    event: T,
    listener: TypedWebSocketEventListener<T>
  ): void {
    if (!this.webSocketClient) {
      throw new Error('WebSocket is not connected');
    }

    // 🔹 Verifica se o listener já está registrado para evitar duplicação
    const existingListeners = this.eventListeners.get(event) || [];
    if (existingListeners.includes(listener as WebSocketEventListener)) {
      console.warn(`Listener already registered for event ${event}, reusing.`);
      return;
    }

    // Conectar o listener diretamente
    this.webSocketClient.on(event, listener);

    // Armazenar o listener para referência e limpeza futura
    existingListeners.push(listener as WebSocketEventListener);
    this.eventListeners.set(event, existingListeners);

    console.log(`Event listener successfully registered for ${event}`);
  }

  /**
   * Registers a one-time event listener for WebSocket events.
   *
   * @param {T} event - The event type to listen for
   * @param {Function} listener - Callback function for handling the event
   * @throws {Error} If WebSocket is not connected
   */
  public once<T extends WebSocketEvent['type']>(
    event: T,
    listener: TypedWebSocketEventListener<T>
  ): void {
    if (!this.webSocketClient) {
      throw new Error('WebSocket is not connected');
    }

    // 🔹 Check if an identical listener already exists to avoid duplication
    const existingListeners = this.eventListeners.get(event) || [];
    if (existingListeners.includes(listener as WebSocketEventListener)) {
      console.warn(
        `One-time listener already registered for event ${event}, reusing.`
      );
      return;
    }

    const wrappedListener = (data: Extract<WebSocketEvent, { type: T }>) => {
      listener(data);
      this.off(event, wrappedListener);
    };

    this.webSocketClient.once(event, wrappedListener);
    this.eventListeners.set(event, [
      ...existingListeners,
      wrappedListener as WebSocketEventListener,
    ]);

    console.log(`One-time event listener registered for ${event}`);
  }

  /**
   * Removes an event listener for WebSocket events.
   *
   * @param {T} event - The event type to remove listener for
   * @param {Function} listener - The listener function to remove
   */
  public off<T extends WebSocketEvent['type']>(
    event: T,
    listener: TypedWebSocketEventListener<T>
  ): void {
    if (!this.webSocketClient) {
      console.warn('No WebSocket connection to remove listener from');
      return;
    }

    this.webSocketClient.off(event, listener);
    const existingListeners = this.eventListeners.get(event) || [];
    this.eventListeners.set(
      event,
      existingListeners.filter(
        (l) => l !== (listener as WebSocketEventListener)
      )
    );

    console.log(`Event listener removed for ${event}`);
  }

  /**
   * Closes the WebSocket connection if one exists.
   */
  public closeWebSocket(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.webSocketClient) {
        console.warn('No WebSocket connection to close');
        resolve();
        return;
      }

      console.log('Closing WebSocket connection and cleaning up listeners.');

      const closeTimeout = setTimeout(() => {
        if (this.webSocketClient) {
          this.webSocketClient.removeAllListeners();
          this.webSocketClient = undefined;
        }
        resolve();
      }, 5000);

      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach((listener) => {
          this.webSocketClient?.off(
            event as WebSocketEvent['type'],
            listener as (...args: any[]) => void
          );
        });
      });
      this.eventListeners.clear();

      this.webSocketClient.once('close', () => {
        clearTimeout(closeTimeout);
        this.webSocketClient = undefined;
        console.log('WebSocket connection closed');
        resolve();
      });

      this.webSocketClient
        .close()
        .then(() => {
          clearTimeout(closeTimeout);
          this.webSocketClient = undefined;
          resolve();
        })
        .catch((error) => {
          console.error('Error during WebSocket close:', error);
          clearTimeout(closeTimeout);
          this.webSocketClient = undefined;
          resolve();
        });
    });
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
    return !!this.webSocketClient && this.webSocketClient.isConnected();
  }
}
